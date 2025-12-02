import { useEffect, useRef, useState } from 'react';
import { FaBroadcastTower, FaLink, FaMicrophone, FaMicrophoneSlash, FaPaperPlane, FaPause, FaPlay, FaSignal, FaTimes, FaUsers, FaVideo, FaVideoSlash, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const FALLBACK_VIDEO_URL = 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4';

const liveMovie = {
  title: 'Avengers: Endgame — Watch Party',
  tagline: 'Huyền thoại siêu anh hùng trở lại, cùng xem bản 4K HDR.',
  overview:
    'Sau cú búng tay của Thanos, các Avengers còn lại gom sức mạnh cuối cùng để đảo ngược mọi chuyện. Cùng xem lại khoảnh khắc lịch sử, khám phá easter eggs và trò chuyện cùng fan cứng.',
  releaseDate: '2019-04-26T00:00:00.000Z',
  runtime: 181,
  rating: { average: 8.6 },
  ageRating: 'PG-13',
  genres: ['Superhero', 'Action', 'Sci-Fi'],
  views: 5230,
  slug: 'avengers-endgame-watch-party',
  poster: 'https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  backdrop: 'https://image.tmdb.org/t/p/original/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
  videos: [
    {
      quality: '4k',
      url: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
      size: '25 Mbps',
      language: 'vi'
    },
    {
      quality: '1080p',
      url: 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4',
      size: '12 Mbps',
      language: 'vi'
    }
  ]
};

const demoParticipants = [
  { id: 'host', name: 'Linh Đặng', role: 'Host', avatar: 'https://i.pravatar.cc/150?img=32', accent: 'from-pink-500/60 via-red-500/60 to-orange-500/40' },
  { id: 'guest', name: 'Huy Bùi', role: 'Reviewer', avatar: 'https://i.pravatar.cc/150?img=12', accent: 'from-fuchsia-500/40 to-blue-500/30' },
  { id: 'viewer-1', name: 'An Võ', role: 'Fan cứng', avatar: 'https://i.pravatar.cc/150?img=5', accent: 'from-cyan-500/30 to-emerald-400/20' },
  { id: 'viewer-2', name: 'Tú Phạm', role: 'Premium', avatar: 'https://i.pravatar.cc/150?img=17', accent: 'from-purple-500/30 to-indigo-500/20' },
  { id: 'viewer-3', name: 'My Trần', role: 'VIP', avatar: 'https://i.pravatar.cc/150?img=48', accent: 'from-amber-400/30 to-red-400/20' },
  { id: 'viewer-4', name: 'Ken Nguyễn', role: 'Viewer', avatar: 'https://i.pravatar.cc/150?img=27', accent: 'from-sky-500/30 to-purple-500/20' }
];

const defaultMessages = [
  { id: 1, author: 'Linh Đặng', role: 'Host', text: 'Chào mọi người! Chuẩn bị tới cảnh hậu trường cực cháy 🔥', timestamp: '19:58' },
  { id: 2, author: 'Huy Bùi', role: 'Reviewer', text: 'Ai thích OST của phim này điểm danh nhé 🎧', timestamp: '19:59' },
  { id: 3, author: 'My Trần', role: 'VIP', text: 'Mình mời thêm 2 bạn vào phòng rồi, hóng quá!', timestamp: '19:59' }
];

const reactionPalette = ['🔥', '😍', '👏', '😂', '🤯', '💜'];
const ambientEmojiPalette = ['✨', '🍿', '🎬', '⚡', '💥', '🌌', '🎧', '🚀'];

const formatRuntime = (runtime) => {
  if (!runtime) return null;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours <= 0) return `${minutes} phút`;
  return `${hours}h ${minutes}m`;
};

const normalizeQuality = (quality) => {
  if (!quality) return '4K';
  return typeof quality === 'string' ? quality.toUpperCase() : String(quality).toUpperCase();
};

const formatLanguage = (language) => {
  if (!language) return 'VI';
  return language.length <= 3 ? language.toUpperCase() : language;
};

const getRatingValue = (rating) => {
  if (rating == null) return null;
  if (typeof rating === 'number') return rating;
  if (typeof rating === 'object') {
    return rating.average ?? rating.tmdb ?? rating.imdb ?? null;
  }
  return null;
};

function LiveRoom() {
  const featuredMovie = liveMovie;
  const navigate = useNavigate();
  const [selectedQuality, setSelectedQuality] = useState(liveMovie.videos[0]);
  const [messages, setMessages] = useState(defaultMessages);
  const [messageInput, setMessageInput] = useState('');
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [activeParticipant, setActiveParticipant] = useState(demoParticipants[0].id);
  const [showTheater, setShowTheater] = useState(false);
  const [ambientEmojis, setAmbientEmojis] = useState([]);

  const videoRef = useRef(null);

  const movieGenres = featuredMovie.genres ?? [];
  const streamTitle = featuredMovie.title;
  const streamTagline = featuredMovie.tagline;
  const streamOverview = featuredMovie.overview;
  const releaseYear = featuredMovie.releaseDate ? new Date(featuredMovie.releaseDate).getFullYear() : null;
  const runtimeLabel = formatRuntime(featuredMovie.runtime);
  const ratingValue = getRatingValue(featuredMovie.rating);
  const ratingLabel = ratingValue ? ratingValue.toFixed(1) : null;
  const videoSources = featuredMovie.videos ?? [];
  const videoSource = selectedQuality?.url || videoSources[0]?.url || FALLBACK_VIDEO_URL;
  const qualityLabel = normalizeQuality(selectedQuality?.quality || videoSources[0]?.quality || '4K');
  const bitrateLabel = selectedQuality?.size || '8.2 Mbps';
  const viewersCount = featuredMovie.views ? Math.max(featuredMovie.views, 128) : 238;
  const liveLink = `https://mezoo.live/room/${featuredMovie.slug}`;
  const hashtags = (() => {
    const tags = ['#mezooLive'];
    if (featuredMovie?.title) tags.push(`#${featuredMovie.title.replace(/\s+/g, '')}`);
    movieGenres.slice(0, 2).forEach((genre) => tags.push(`#${genre.replace(/\s+/g, '')}`));
    return Array.from(new Set(tags)).slice(0, 4);
  })();
  const timelineMoments = [
    { time: '20:00', title: 'Đếm ngược', detail: 'Chia sẻ playlist và mời bạn bè', type: 'upcoming' },
    { time: '20:05', title: 'Warm-up', detail: 'Bật camera, giới thiệu host & khách mời', type: 'upcoming' },
    { time: '20:10', title: 'Xem chính', detail: `Together watching "${streamTitle}"`, type: 'current' },
    { time: '21:05', title: 'After talk', detail: 'Bật mic trò chuyện, vote ending', type: 'upcoming' }
  ];
  const spotlightUser = demoParticipants.find((p) => p.id === activeParticipant);

  const liveTitle = featuredMovie?.title ? `Phòng live - ${featuredMovie.title}` : 'Phòng live';
  useDocumentTitle(liveTitle);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = `${Date.now()}-${Math.random()}`;
      const icon = ambientEmojiPalette[Math.floor(Math.random() * ambientEmojiPalette.length)];
      const left = Math.random() * 70 + 15; // keep within center area
      const duration = Math.random() * 4 + 6; // 6-10s
      const delay = Math.random() * 1.5;

      const emoji = { id, icon, left, duration, delay };
      setAmbientEmojis((prev) => [...prev.slice(-20), emoji]);

      setTimeout(() => {
        setAmbientEmojis((prev) => prev.filter((item) => item.id !== id));
      }, (duration + delay) * 1000);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      setIsPlaying((prev) => !prev);
      return;
    }
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      if (playPromise?.then) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!messageInput.trim()) return;
    const newMessage = {
      id: Date.now(),
      author: 'Bạn',
      role: 'Bạn',
      text: messageInput.trim(),
      timestamp: 'Vừa xong',
      isSelf: true
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');
  };

  const handleReaction = (icon) => {
    const reactionId = `${icon}-${Date.now()}`;
    setFloatingReactions((prev) => [
      ...prev,
      { id: reactionId, icon, left: `${Math.random() * 60 + 20}%` }
    ]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((reaction) => reaction.id !== reactionId));
    }, 1800);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveLink);
      setCopied(true);
    } catch (error) {
      console.error('Unable to copy room link', error);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05060a] text-white overflow-hidden">
      <div className="live-room-bg" />
      <div className="live-room-bg live-room-bg-2" />
      <div className="live-aurora" />
      <div className="live-neon-grid" />
      <div className="live-laser" />
      <div className="live-laser live-laser-2" />
      <div className="live-room-atmosphere">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="live-particle"
            style={{ left: `${Math.random() * 100}%`, animationDelay: `${index * 0.8}s` }}
          />
        ))}
      </div>
      <div className="live-floating-orb live-floating-orb-1" />
      <div className="live-floating-orb live-floating-orb-2" />
      <div aria-hidden="true" className="live-emoji-stream">
        {ambientEmojis.map((emoji) => (
          <span
            key={emoji.id}
            className="live-emoji"
            style={{
              left: `${emoji.left}%`,
              animationDuration: `${emoji.duration}s`,
              animationDelay: `${emoji.delay}s`
            }}
          >
            {emoji.icon}
          </span>
        ))}
      </div>

      <main className="relative z-10 min-h-screen pt-10 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm hover:bg-white/20 transition"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 14a1 1 0 0 1-.707-.293l-5-5a1 1 0 0 1 0-1.414l5-5A1 1 0 1 1 11.707 3.7L7.414 8l4.293 4.293A1 1 0 0 1 11 14Z" />
              </svg>
              Trở về Trang chủ
            </button>
          </div>
          <header className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="uppercase tracking-[0.4em] text-xs text-gray-400">mezoo live room</p>
                <h1 className="text-3xl md:text-4xl font-black mt-2">
                  {streamTitle}
                </h1>
                <p className="text-gray-400 mt-2">
                  {streamTagline}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                  <FaSignal className="text-emerald-400" />
                  Độ trễ 2.3s
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20">
                  <FaUsers className="text-blue-400" />
                  {viewersCount} người đang xem
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-netflix-red/40 transition"
                >
                  <FaLink />
                  {copied ? 'Đã copy link' : 'Mời bạn vào' }
                </button>
              </div>
            </div>

            {spotlightUser && (
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <div className="relative">
                    <img src={spotlightUser.avatar} alt={spotlightUser.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="live-status-dot" />
                  </div>
                  <div>
                    <p className="font-semibold">{spotlightUser.name}</p>
                    <p className="text-xs text-gray-400">Đang lên sóng ({spotlightUser.role})</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {demoParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => setActiveParticipant(participant.id)}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        participant.id === activeParticipant ? 'border-netflix-red text-white bg-netflix-red/10' : 'border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {participant.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </header>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 space-y-6">
              <div className="relative rounded-3xl overflow-hidden glass-panel p-0 live-video-shell">
                <div className="live-video-border" />
                <div className="live-video-ripple" />
                <div className="aspect-video w-full relative bg-black">
                  <video
                    key={videoSource}
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={videoSource}
                    poster={featuredMovie?.backdrop || featuredMovie?.poster}
                    autoPlay
                    loop
                    muted={muted}
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onClick={() => setShowTheater(true)}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="live-video-shine" />
                  <div className="live-scanline" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 text-sm font-semibold tracking-wide">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-3 text-sm">
                    <div className="px-4 py-1.5 rounded-full bg-black/50 border border-white/10">
                      {bitrateLabel}
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-black/50 border border-white/10">
                      {qualityLabel}
                    </div>
                  </div>

                  {floatingReactions.map((reaction) => (
                    <span
                      key={reaction.id}
                      className="floating-reaction"
                      style={{ left: reaction.left }}
                    >
                      {reaction.icon}
                    </span>
                  ))}

                  <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-netflix-red via-orange-500 to-yellow-400 animate-gradient" style={{ width: '72%' }} />
                      </div>
                      <span>01:12:08</span>
                      <span>/</span>
                      <span>{runtimeLabel || '01:45:00'}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                      <button
                        className="live-control"
                        onClick={handleTogglePlay}
                      >
                        {isPlaying ? <FaPause /> : <FaPlay />}<span>{isPlaying ? 'Tạm dừng' : 'Phát tiếp'}</span>
                      </button>
                      <button className="live-control" onClick={() => setMuted((prev) => !prev)}>
                        {muted ? <FaVolumeMute /> : <FaVolumeUp />}<span>{muted ? 'Mở tiếng' : 'Tắt tiếng'}</span>
                      </button>
                      <button className="live-control" onClick={() => setMicEnabled((prev) => !prev)}>
                        {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}<span>{micEnabled ? 'Tắt mic' : 'Bật mic'}</span>
                      </button>
                      <button className="live-control" onClick={() => setCameraEnabled((prev) => !prev)}>
                        {cameraEnabled ? <FaVideo /> : <FaVideoSlash />}<span>{cameraEnabled ? 'Tắt camera' : 'Bật camera'}</span>
                      </button>
                      <button className="live-control">
                        <FaBroadcastTower /><span>Share screen</span>
                      </button>
                      <button className="live-control" onClick={() => setShowTheater(true)}>
                        <FaVideo />
                        <span>Mở player</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-400">
                  {hashtags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10">{tag}</span>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {timelineMoments.map((moment) => (
                    <div
                      key={moment.time}
                      className={`p-4 rounded-2xl border transition live-timeline-card ${
                        moment.type === 'current'
                          ? 'border-netflix-red/40 bg-netflix-red/10 shadow-[0_0_30px_rgba(229,9,20,0.25)]'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <span className="live-timeline-glow" />
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                        {moment.time}
                      </p>
                      <h3 className="text-xl font-semibold mt-2">{moment.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{moment.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {featuredMovie && (
                <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6 md:flex-row live-detail-panel">
                  <div className="md:w-1/3">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={featuredMovie.poster || featuredMovie.backdrop}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover"
                      />
                      {releaseYear && (
                        <span className="absolute top-4 left-4 text-xs px-3 py-1 rounded-full bg-black/70 border border-white/10">
                          {releaseYear}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-3 text-sm text-gray-300">
                      {releaseYear && (
                        <span className="live-chip">{releaseYear}</span>
                      )}
                      {runtimeLabel && (
                        <span className="live-chip">{runtimeLabel}</span>
                      )}
                      {ratingLabel && (
                        <span className="live-chip">IMDb {ratingLabel}</span>
                      )}
                      {featuredMovie?.ageRating && (
                        <span className="live-chip">{featuredMovie.ageRating}</span>
                      )}
                    </div>
                    {streamOverview && (
                      <p className="text-gray-300 leading-relaxed">{streamOverview}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {movieGenres.slice(0, 6).map((genre) => (
                        <span key={genre} className="live-chip bg-white/5">
                          {genre}
                        </span>
                      ))}
                    </div>
                    {videoSources.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Chọn chất lượng</p>
                        <div className="flex flex-wrap gap-2">
                          {videoSources.map((video) => {
                            const videoId = video._id || `${video.quality}-${video.url}`;
                            const isActive = selectedQuality?.url === video.url;
                            return (
                              <button
                                key={videoId}
                                onClick={() => setSelectedQuality(video)}
                                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                                  isActive ? 'bg-netflix-red/20 border-netflix-red text-white' : 'border-white/15 text-gray-300 hover:text-white'
                                }`}
                              >
                                {normalizeQuality(video.quality)} • {formatLanguage(video.language)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <div className="glass-panel rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Participants</p>
                    <h2 className="text-2xl font-semibold">{demoParticipants.length} người</h2>
                  </div>
                  <button className="px-4 py-2 text-sm rounded-full border border-white/10 hover:border-white/40 transition">
                    Quản lý quyền
                  </button>
                </div>
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 scrollbar-hide">
                  {demoParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <div className={`p-0.5 rounded-full bg-gradient-to-br ${participant.accent}`}>
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{participant.name}</p>
                        <p className="text-xs text-gray-400">{participant.role}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        {participant.id === 'host' ? 'Host' : participant.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-0 flex flex-col h-[520px]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Live chat</p>
                    <h2 className="text-2xl font-semibold">Trò chuyện</h2>
                  </div>
                  <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300">
                    Slow-mode 3s
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`text-sm ${message.isSelf ? 'text-netflix-red' : 'text-gray-100'}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{message.author}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {message.role && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10">{message.role}</span>}
                      </div>
                      <p className="text-gray-300 mt-1">{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    {reactionPalette.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => handleReaction(icon)}
                        className="text-2xl hover:scale-125 transition-transform"
                        aria-label={`Reaction ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <form className="flex gap-3" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
                      placeholder="Viết gì đó hay ho..."
                      className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 focus:outline-none focus:border-netflix-red/60"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-2xl bg-netflix-red hover:bg-red-700 transition flex items-center gap-2 font-semibold"
                    >
                      Gửi
                      <FaPaperPlane size={14} />
                    </button>
                  </form>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {showTheater && (
        <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowTheater(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-2xl"
              aria-label="Đóng player"
            >
              <FaTimes />
            </button>
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black">
              <video
                className="w-full h-full"
                src={videoSource}
                poster={featuredMovie?.backdrop || featuredMovie?.poster}
                controls
                autoPlay
                playsInline
              />
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Bạn đang mở player rạp mini — {streamTitle}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LiveRoom;
