import React, { useCallback, useState } from 'react';
import { BellIcon } from 'lucide-react';
import { notifications } from '../data/notifications';
import { useClickOutside } from '../hooks/useClickOutside';
import { statusClasses } from '../utils/sensors';

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close, open);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative grid h-9 w-9 place-items-center rounded-full text-ink transition-colors duration-150 ease-out hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        
        <BellIcon size={20} className="fill-ink" aria-hidden="true" />
        {unread > 0 &&
        <span className="absolute right-1 top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-heat-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        }
      </button>
      {open &&
      <div className="absolute right-0 top-11 z-40 w-[300px] overflow-hidden rounded-xl border border-line bg-white shadow-pop">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="text-[13px] font-bold text-ink">Notifications</p>
            <button
            type="button"
            onClick={() => setUnread(0)}
            disabled={unread === 0}
            className="text-[12px] font-semibold text-brand-600 disabled:text-ink-soft">
            
              Mark all read
            </button>
          </div>
          <ul>
            {notifications.map((n, i) =>
          <li key={n.id} className="flex gap-2.5 border-b border-line px-4 py-3 last:border-0">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i < unread ? statusClasses[n.status].dot : 'bg-line'}`} aria-hidden="true" />
                <div>
                  <p className="text-[13px] font-semibold text-ink">{n.title}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-ink-muted">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-ink-soft">{n.time}</p>
                </div>
              </li>
          )}
          </ul>
        </div>
      }
    </div>);

}