"use client";

import { useEffect, useRef, useState } from "react";

export default function DashPlayer({ url, className = "" }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined' || !videoRef.current || !url) {
            setIsLoading(false);
            return;
        }

        let player = null;

        const initPlayer = async () => {
            try {
                setIsLoading(true);

                // Dynamically import dashjs to avoid SSR issues
                const dashjs = await import('dashjs');

                // Create player instance - try different import patterns
                if (dashjs.MediaPlayer) {
                    player = dashjs.MediaPlayer().create();
                } else if (dashjs.default && dashjs.default.MediaPlayer) {
                    player = dashjs.default.MediaPlayer().create();
                } else if (dashjs.default) {
                    // Sometimes dashjs exports as default
                    player = dashjs.default().create();
                } else {
                    throw new Error("MediaPlayer not found in dashjs module");
                }

                playerRef.current = player;

                // Initialize the player with the provided URL
                player.initialize(videoRef.current, url, false);
                // console.log("DashPlayer: Player initialized successfully");

                // Configure player settings
                player.updateSettings({
                    streaming: {
                        buffer: {
                            fastSwitchEnabled: true
                        }
                    }
                });

                // // Add event listeners for debugging
                // player.on('error', (e) => {
                //     console.error("DashPlayer Error:", e);
                //     setError(e.error || "Unknown error");
                // });

                // player.on('canPlay', () => {
                //     console.log("DashPlayer: Can play");
                //     setIsLoading(false);
                // });

                // player.on('playbackStarted', () => {
                //     console.log("DashPlayer: Playback started");
                // });

                setIsLoading(false);

            } catch (err) {
                console.error("DashPlayer: Error initializing player:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        initPlayer();

        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.reset();
                } catch (e) {
                    console.error("Error resetting player:", e);
                }
                playerRef.current = null;
            }
        };
    }, [url]);

    return (
        <div className="relative w-full">
            <video
                ref={videoRef}
                controls
                className={className || "w-full max-w-3xl"}
                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                    Loading player...
                </div>
            )}
            {error && (
                <div className="text-red-500 mt-2 p-2 bg-red-50 rounded font-semibold text-lg">
                    Error loading video: {error}
                </div>
            )}
        </div>
    );
}
