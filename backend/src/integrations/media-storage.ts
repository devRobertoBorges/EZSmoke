// Ponto único onde o endereço da mídia é gerado.
//
// TEMPORÁRIO: quando o storage (S3, R2...) for escolhido, esta função
// vai gerar uma URL assinada com expiração. O resto do código não
// precisará mudar, porque todo mundo chama esta função.
export function getExecutionMediaUrl(mediaKey: string | null): string | null {
    if (!mediaKey) {
        return null;
    }

    return `/media/${mediaKey}`;
}