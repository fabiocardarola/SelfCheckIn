import { TestBed } from '@angular/core/testing';
import { BookingService } from '../booking.service';
import { PostCategoryComponent, PostsResponse, wifiPayload, youtubeLink, postImageUrl } from './post-category.component';
import { API_BASE_URL } from '../api.config';
import { postCopy } from './post-copy';

const response = (code = '0012'): PostsResponse => ({posts:[{id:1,type:'door_code',body:'<b>plain text</b>'}],wifi:null,door:{code,documents_ok:true,quality_ok:true,warnings:[]}});
describe('Post category', () => {
  const request=vi.fn();
  beforeEach(() => { request.mockReset(); TestBed.configureTestingModule({providers:[{provide:BookingService,useValue:{request}}]}); });
  function create() { const f=TestBed.createComponent(PostCategoryComponent);f.componentRef.setInput('category','AB001');f.componentRef.setInput('language','it');f.detectChanges();return f; }
  it('validates YouTube hosts and ids and escapes Wi-Fi special characters', () => {
    expect(youtubeLink('https://youtu.be/abcdefghijk')).toBe('https://www.youtube.com/watch?v=abcdefghijk');
    expect(youtubeLink('https://youtube.com/shorts/abcdefghijk')).toBeTruthy();
    for(const v of ['javascript:alert(1)','https://youtube.com.evil.test/watch?v=abcdefghijk','https://youtube.com/watch?v=abc','http://youtu.be/abcdefghijk']) expect(youtubeLink(v)).toBeNull();
    expect(wifiPayload('a;b', 'c:d\\e')).toBe('WIFI:T:WPA;S:a\\;b;P:c\\:d\\\\e;;');
    expect(wifiPayload('open','')).toBe('WIFI:T:nopass;S:open;P:;;');
  });
  it('loads uploaded images from hhapi without an HHAdmin URL', () => {
    const path='/sci_post_assets/12345678-1234-1234-1234-123456789abc.png';
    expect(postImageUrl(path)).toBe(`${API_BASE_URL}${path}`);
    expect(postImageUrl('https://example.com/photo.png')).toBe('https://example.com/photo.png');
    for (const bad of ['/sci-post-assets/12345678-1234-1234-1234-123456789abc.png', '/sci_post_assets/../secret', 'javascript:alert(1)', '//example.com/a.png']) expect(postImageUrl(bad)).toBeNull();
  });
  it('renders plain text and clears old door code when refresh fails', async () => {
    request.mockResolvedValueOnce(response()).mockRejectedValueOnce(new Error());
    const f=create();await f.whenStable();f.detectChanges();
    expect(f.nativeElement.textContent).toContain('0012');
    expect(f.nativeElement.querySelector('b')).toBeNull();
    f.componentInstance.refresh();f.detectChanges();expect(f.nativeElement.textContent).not.toContain('0012');
    await f.whenStable();f.detectChanges();expect(f.componentInstance.error()).toBe(true);expect(f.componentInstance.data()).toBeNull();
  });
  it('ignores late responses after category or language changes', async () => {
    let resolve!:(v:PostsResponse)=>void;
    request.mockReturnValueOnce(new Promise<PostsResponse>(r=>resolve=r)).mockResolvedValueOnce(response('9876'));
    const f=create();f.componentRef.setInput('category','AB002');f.componentRef.setInput('language','en');f.detectChanges();
    await f.whenStable();resolve(response('0012'));await Promise.resolve();f.detectChanges();
    expect(f.componentInstance.data()?.door?.code).toBe('9876');
    expect(request).toHaveBeenLastCalledWith('sci_posts',{category:'AB002',language:'en'});
  });
  it('prevents duplicate commands and shows uncertainty without retrying', async () => {
    request.mockResolvedValueOnce(response());const f=create();await f.whenStable();
    let reject!:(e:Error)=>void;request.mockReturnValueOnce(new Promise((_,r)=>reject=r));
    const show=vi.fn();f.componentInstance.dialog()!.nativeElement.showModal=show;
    const post={id:2,type:'action',body:'',action_code:'F001',action_enabled:true};
    const event={currentTarget:document.createElement('button')} as unknown as Event;
    const first=f.componentInstance.activate(post,event);await f.componentInstance.activate(post,event);
    expect(request.mock.calls.filter(c=>c[0]==='sci_post_action')).toHaveLength(1);
    request.mockResolvedValue(response());reject(new Error('timeout'));await first;
    expect(f.componentInstance.result()).toBe(postCopy('it').uncertain);expect(show).toHaveBeenCalledOnce();
    expect(request.mock.calls.filter(c=>c[0]==='sci_post_action')).toHaveLength(1);
  });
  it('has complete UI copy in all ten languages', () => {
    for(const lang of ['it','en','pl','fr','de','es','pt','ko','ja','zh']) expect(Object.values(postCopy(lang)).every(v=>typeof v==='string'&&v.length>0)).toBe(true);
  });
});
