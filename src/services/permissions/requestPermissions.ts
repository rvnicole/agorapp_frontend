export async function requestCameraAndMic() {
    return navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
};

export async function requestLocation() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}