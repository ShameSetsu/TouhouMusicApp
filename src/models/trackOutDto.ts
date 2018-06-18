export type AlbumTrackOutDto = {
    _id: string,
    album: string,
    albumThumbnail: string,
    trackNumber: number,
    artist: {
        _id: string,
        name: string
    },
    duration: number,
    genre: Array<{
        _id: string,
        name: string
    }>,
    release: string,
    title: string,
    originalTitle: {
        _id: string,
        name: string
    },
    format: string,
    file: string
}