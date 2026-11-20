'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, Video, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MeetingPrejoinProps {
  meetingTitle: string;
  isTeacher: boolean;
  onJoin: (options: { videoEnabled: boolean; audioEnabled: boolean }) => void;
  onBack: () => void;
}

export function MeetingPrejoin({ meetingTitle, isTeacher, onJoin, onBack }: MeetingPrejoinProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  // Initialize media devices on mount
  useEffect(() => {
    let active = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Setup audio meter
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkVolume = () => {
            if (!active) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(checkVolume);
          };
          checkVolume();
        } catch {
          // Audio analyzer optional fallback
        }
      } catch {
        if (active) setHasPermissionError(true);
      }
    }

    initMedia();

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
      }
    }
    setCameraEnabled((prev) => !prev);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
      }
    }
    setMicEnabled((prev) => !prev);
  };

  const handleJoinRoom = () => {
    // Release local preview stream before joining Meeting to avoid device lock
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onJoin({ videoEnabled: cameraEnabled, audioEnabled: micEnabled });
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="ghost"
            onClick={onBack}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs gap-1.5 h-8 px-2.5"
          >
            <ArrowLeft className="size-4" />
            <span>Quay lại</span>
          </Button>

          <Badge
            variant="secondary"
            className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/30 gap-1.5"
          >
            <ShieldCheck className="size-3 text-purple-400" />
            <span>{isTeacher ? 'Giảng viên / Chủ phòng' : 'Học sinh tham gia'}</span>
          </Badge>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-xl font-bold text-zinc-100">{meetingTitle}</h2>
          <p className="text-xs text-zinc-400">Kiểm tra camera & micro trước khi vào phòng học</p>
        </div>

        {/* Video Preview Box */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg">
          {cameraEnabled && !hasPermissionError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <CameraOff className="size-12 stroke-[1.5]" />
              <span className="text-xs">
                {hasPermissionError ? 'Chưa cấp quyền camera' : 'Camera đang tắt'}
              </span>
            </div>
          )}

          {/* Audio level meter overlay */}
          {micEnabled && (
            <div className="absolute bottom-3 left-3 bg-zinc-900/80 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-zinc-700/60">
              <Mic className="size-3 text-emerald-400" />
              <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick controls on video */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              size="sm"
              variant={cameraEnabled ? 'secondary' : 'destructive'}
              onClick={toggleCamera}
              className="rounded-full size-9 p-0 shadow-md"
              title={cameraEnabled ? 'Tắt Camera' : 'Bật Camera'}
            >
              {cameraEnabled ? <Camera className="size-4" /> : <CameraOff className="size-4" />}
            </Button>

            <Button
              size="sm"
              variant={micEnabled ? 'secondary' : 'destructive'}
              onClick={toggleMic}
              className="rounded-full size-9 p-0 shadow-md"
              title={micEnabled ? 'Tắt Micro' : 'Bật Micro'}
            >
              {micEnabled ? <Mic className="size-4" /> : <MicOff className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Join Action Button */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <Button
            size="lg"
            onClick={handleJoinRoom}
            className="w-full sm:w-auto min-w-56 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm h-11 px-6 rounded-xl shadow-md gap-2"
          >
            <Video className="size-4" />
            <span>Tham gia phòng học ngay</span>
          </Button>
          <p className="text-[11px] text-zinc-500">
            Hệ thống sẽ tự động điểm danh khi bạn có mặt trong phòng
          </p>
        </div>
      </div>
    </div>
  );
}
