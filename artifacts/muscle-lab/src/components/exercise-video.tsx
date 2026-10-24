import { useState } from 'react';
import { ExternalLink, Play, VideoOff } from 'lucide-react';
import type { ExerciseDemoVideo } from '@/data/exercise-videos';

export function ExerciseVideo({ video, exerciseName }: { video: ExerciseDemoVideo; exerciseName: string }) {
  const [tryUnavailable, setTryUnavailable] = useState(false);
  const showPlayer = !video.unavailable || tryUnavailable;
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  return (
    <section className="mt-10" aria-label={`${exerciseName} video demonstration`} data-testid="section-exercise-video">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-[#232a16]">Video demonstration</h2>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#232a16] underline underline-offset-4"
          data-testid="link-exercise-youtube"
        >
          Open on YouTube <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
      <div className={`relative overflow-hidden rounded-2xl border border-[#232a16]/15 bg-[#f4f2e9] ${showPlayer ? 'aspect-video' : 'min-h-56 sm:aspect-video sm:min-h-0'}`}>
        {showPlayer ? (
          <iframe
            key={video.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&playsinline=1`}
            title={`${exerciseName} — video demonstration`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            data-testid="iframe-exercise-video"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-[#232a16]">
            <VideoOff className="h-7 w-7 opacity-60" aria-hidden="true" />
            <p className="font-display text-lg font-bold">Video currently unavailable</p>
            <p className="max-w-sm text-sm text-[#232a16]/75">YouTube could not find the supplied link when it was checked.</p>
            <button
              type="button"
              onClick={() => setTryUnavailable(true)}
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#232a16] px-4 py-2 text-sm font-semibold text-[#ecf39e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#232a16]"
              data-testid="button-try-exercise-video"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" /> Try loading anyway
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[#232a16]/70">
        {video.unavailable
          ? 'The original supplied link is preserved. A replacement may be needed if it remains unavailable.'
          : 'If playback is restricted by the video owner, open the video on YouTube.'}
      </p>
    </section>
  );
}
