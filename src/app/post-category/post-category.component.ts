import { Component, computed, effect, ElementRef, HostListener, inject, input, OnDestroy, output, signal, viewChild } from '@angular/core';
import { BookingService, GuestApiError } from '../booking.service';
import { toDataURL } from 'qrcode';
import { API_BASE_URL } from '../api.config';
import { postCopy } from './post-copy';

export interface Post { id: number; type: string; body: string; image_url?: string; youtube_url?: string; button_label?: string; action_code?: string; action_enabled?: boolean; }
export interface PostsResponse { posts: Post[]; wifi: { ssid: string; password: string } | null; door: { code: string | null; documents_ok: boolean; quality_ok: boolean; warnings: {key:string; body:string}[] } | null; }
export function wifiPayload(ssid: string, password: string): string {
  const escape = (v: string) => v.replace(/[\\;,:"']/g, '\\$&');
  return `WIFI:T:${password ? 'WPA' : 'nopass'};S:${escape(ssid)};P:${escape(password)};;`;
}
export function postImageUrl(value = ''): string | null {
  if (/^\/sci_post_assets\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\.(jpg|png)$/.test(value)) return `${API_BASE_URL}${value}`;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}
export function youtubeLink(value = ''): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || !['youtube.com','www.youtube.com','m.youtube.com','youtu.be'].includes(url.hostname)) return null;
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\/([A-Za-z0-9_-]{11})$/.exec(url.pathname)?.[2];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube.com/watch?v=${id}` : null;
  } catch { return null; }
}
@Component({ selector:'app-post-category', templateUrl:'./post-category.component.html', styleUrl:'./post-category.component.scss' })
export class PostCategoryComponent implements OnDestroy {
  readonly busyChange = output<boolean>();
  readonly category = input.required<'AB001' | 'AB002'>();
  readonly language = input.required<string>();
  readonly copy = computed(() => postCopy(this.language()));
  private readonly api = inject(BookingService);
  readonly data = signal<PostsResponse | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly denied = signal(false);
  readonly qr = signal('');
  readonly failedImages = signal<number[]>([]);
  readonly pending = signal<number | null>(null);
  readonly result = signal('');
  readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private opener: HTMLElement | null = null;
  private openerId = 0;
  private generation = 0;
  private destroyed = false;
  readonly youtubeLink = youtubeLink;
  readonly postImageUrl = postImageUrl;
  constructor() { effect(() => { const category=this.category(), language=this.language(); void this.load(category,language); }); }
  ngOnDestroy(): void { this.destroyed=true; this.generation++; }
  @HostListener('document:visibilitychange') onVisibility(): void {
    if (document.visibilityState === 'visible') this.refresh();
    else { this.generation++; this.data.set(null); this.qr.set(''); }
  }
  @HostListener('window:pageshow') onPageShow(): void { this.refresh(); }
  refresh(): void { if (!this.pending()) void this.load(this.category(),this.language()); }
  private async load(category: string, language: string): Promise<void> {
    const generation=++this.generation;
    this.data.set(null); this.qr.set(''); this.error.set(false); this.denied.set(false); this.loading.set(true); this.failedImages.set([]);
    try {
      const data=await this.api.request<PostsResponse>('sci_posts',{category,language});
      if (this.destroyed || generation!==this.generation) return;
      if (!data || !Array.isArray(data.posts)) throw new Error('Invalid posts response');
      this.data.set(data);
      if (data.wifi?.ssid) {
        try {
          const qr=await toDataURL(wifiPayload(data.wifi.ssid,data.wifi.password),{width:240,margin:2});
          if (!this.destroyed && generation===this.generation) this.qr.set(qr);
        } catch { /* Text credentials remain available. */ }
      }
    } catch(e) {
      if (!this.destroyed && generation===this.generation) { this.error.set(true); this.denied.set(e instanceof GuestApiError && e.status===403); }
    } finally { if (!this.destroyed && generation===this.generation) this.loading.set(false); }
  }
  imageFailed(id: number): void { this.failedImages.update(ids => [...ids,id]); }
  async activate(post: Post, event: Event): Promise<void> {
    if (this.pending() || !post.action_enabled || post.action_code!=='F001') return;
    this.opener=event.currentTarget as HTMLElement;
    this.openerId=post.id;
    this.pending.set(post.id);
    this.busyChange.emit(true);
    const c=this.copy();
    let message=c.uncertain;
    try {
      const response=await this.api.request<{gate:{success:boolean;code:string}}>('sci_post_action',{category:this.category(),id:post.id,language:this.language()},65000);
      const gate=response.gate;
      const messages:Record<string,string>={COMMAND_SENT:c.sent,STATUS_NOT_UPDATED:c.status,DEVICE_UNAVAILABLE:c.failed,DEVICE_ERROR:c.failed,OUTSIDE_PERIOD:c.period,INVALID_BOOKING:c.booking,INVALID_DATES:c.booking,UNCERTAIN:c.uncertain};
      message=gate && typeof gate.success==='boolean' ? messages[gate.code] ?? c.uncertain : c.uncertain;
      if (gate && !gate.success && ['COMMAND_SENT','STATUS_NOT_UPDATED'].includes(gate.code)) message=c.failed;
    } catch(e) { if(e instanceof GuestApiError) message=e.status===403?c.denied:c.failed; }
    finally { this.pending.set(null); if (!this.destroyed) this.busyChange.emit(false); }
    if(this.destroyed) return;
    this.result.set(message);
    this.dialog()?.nativeElement.showModal();
  }
  closeDialog(): void { this.dialog()?.nativeElement.close(); }
  restoreFocus(): void {
    const target=this.opener?.isConnected ? this.opener : document.getElementById(`post-action-${this.openerId}`) ?? document.getElementById('posts-refresh');
    target?.focus();
  }
}
