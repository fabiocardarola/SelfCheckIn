-- Run before deploying hhapi. Records explicit notice acknowledgement or exit, never consent.
CREATE TABLE IF NOT EXISTS sci_privacy_events (
  pk BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  fkbooking INT NOT NULL,
  notice_version VARCHAR(40) NOT NULL,
  language VARCHAR(5) NOT NULL,
  action VARCHAR(16) NOT NULL,
  recorded_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  KEY ix_sci_privacy_booking (fkbooking, pk)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
