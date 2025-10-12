import { watch } from 'vue';
import { usePlayerStore } from '@/store/playerStore';

export function initMprisBridge() {
  const playerStore = usePlayerStore();

  if (!window.electronAPItest) return; // 安全检查

  // 播放状态变化
  watch(
    () => playerStore.playing,
    (playing) => {
      window.electronAPItest.send('player', { playing });
    }
  );

  // 歌曲元信息变化
  watch(
    () => playerStore.currentMusic,
    (music) => {
      if (!music) return;
      window.electronAPItest.send('metadata', {
        trackId: music.id,
        title: music.name,
        album: music.album,
        artist: music.artist,
        length: playerStore.time,
        artwork: [{ src: music.coverUrl }],
        url: music.url,
      });
    }
  );

  // 进度变化
  watch(
    () => playerStore.progress,
    (progress) => {
      window.electronAPItest.send('playerCurrentTrackTime', progress * playerStore.time);
    }
  );

  // 播放模式
  watch(
    () => playerStore.playMode,
    (mode) => {
      const map = ['off', 'on', 'one'];
      window.electronAPItest.send('switchRepeatMode', map[mode] || 'off');
    }
  );

  // 随机播放列表变化
  watch(
    () => playerStore.shuffledList,
    (list) => {
      window.electronAPItest.send('switchShuffle', !!list);
    }
  );
}
