import { Lock, PlayCircle } from "lucide-react";
import type { MediaType } from "../types/lineup";

interface ExecutionMediaProps {
  mediaUrl: string | null;
  mediaType: MediaType | null;
  previewUrl: string | null;
  locked: boolean;
}

export default function ExecutionMedia({
  mediaUrl,
  mediaType,
  previewUrl,
  locked,
}: ExecutionMediaProps) {
  const previewStyle = previewUrl
    ? { backgroundImage: `url(${previewUrl})` }
    : undefined;

  // Bloqueada: só a prévia, com cadeado por cima
  if (locked) {
    return (
      <div className="media" style={previewStyle}>
        <div className="media__lock">
          <Lock size={32} />
        </div>
      </div>
    );
  }

  // Sem vídeo cadastrado ainda
  if (!mediaUrl) {
    return (
      <div className="media" style={previewStyle}>
        <span className="media__placeholder">
          <PlayCircle size={20} /> Vídeo de execução em breve
        </span>
      </div>
    );
  }

  if (mediaType === "GIF") {
    return (
      <div className="media">
        <img src={mediaUrl} alt="Execução da lineup" />
      </div>
    );
  }

  // README: vídeo curto, automático, sem som e em loop (como um GIF)
  return (
    <div className="media">
      <video src={mediaUrl} autoPlay muted loop playsInline />
    </div>
  );
}