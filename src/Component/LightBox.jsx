
import React, { useCallback, useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function Lightbox({ images, startIndex, onClose }) {
    const [current, setCurrent] = useState(startIndex);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });

    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const panStart = useRef({ x: 0, y: 0 });
    const imgWrapRef = useRef(null);

    const touchStart = useRef({ x: 0, y: 0 });
    const touchPinchDist = useRef(null);
    const touchZoomStart = useRef(1);
    const isSwiping = useRef(false);

    const scrollPosition = useRef(0);

    const reset = useCallback(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    const goPrev = useCallback(() => {
        setCurrent((i) => (i - 1 + images.length) % images.length);
        reset();
    }, [images.length, reset]);

    const goNext = useCallback(() => {
        setCurrent((i) => (i + 1) % images.length);
        reset();
    }, [images.length, reset]);

    /*
     * LOCK PAGE SCROLL
     *
     * Позиция страницы сохраняется один раз.
     * При закрытии она восстанавливается без плавного скролла.
     */
    useEffect(() => {
        const body = document.body;
        const html = document.documentElement;

        const scrollY = window.scrollY;
        scrollPosition.current = scrollY;

        const previousBody = {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
        };

        const previousHtmlScrollBehavior =
            html.style.scrollBehavior;

        // Полностью отключаем smooth scroll
        html.style.scrollBehavior = "auto";

        // Фиксируем страницу на текущей позиции
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";

        return () => {
            const savedScrollY = scrollPosition.current;

            // Сначала отключаем блокировку
            body.style.position = previousBody.position;
            body.style.top = previousBody.top;
            body.style.width = previousBody.width;
            body.style.overflow = previousBody.overflow;

            // Восстанавливаем scroll-behavior
            html.style.scrollBehavior = previousHtmlScrollBehavior;

            /*
             * Восстанавливаем позицию без smooth-анимации.
             * scrollTo выполняется синхронно сразу после снятия fixed.
             */
            window.scrollTo({
                top: savedScrollY,
                left: 0,
                behavior: "instant",
            });
        };
    }, []);

    const onWheel = useCallback((e) => {
        e.preventDefault();

        setZoom((z) =>
            Math.min(
                5,
                Math.max(1, z - e.deltaY * 0.001)
            )
        );
    }, []);

    useEffect(() => {
        const el = imgWrapRef.current;

        if (!el) return;

        el.addEventListener("wheel", onWheel, {
            passive: false,
        });

        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, [onWheel]);

    const onMouseDown = (e) => {
        if (zoom <= 1) return;

        isDragging.current = true;

        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
        };

        panStart.current = {
            ...pan,
        };
    };

    const onMouseMove = (e) => {
        if (!isDragging.current) return;

        setPan({
            x:
                panStart.current.x +
                (e.clientX - dragStart.current.x),

            y:
                panStart.current.y +
                (e.clientY - dragStart.current.y),
        });
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    const getDist = (touches) => {
        const [a, b] = touches;

        return Math.hypot(
            a.clientX - b.clientX,
            a.clientY - b.clientY
        );
    };

    const onTouchStart = (e) => {
        if (e.touches.length === 2) {
            touchPinchDist.current = getDist(e.touches);
            touchZoomStart.current = zoom;
            isSwiping.current = false;

            return;
        }

        if (e.touches.length === 1) {
            const t = e.touches[0];

            touchStart.current = {
                x: t.clientX,
                y: t.clientY,
            };

            if (zoom > 1) {
                isDragging.current = true;

                dragStart.current = {
                    x: t.clientX,
                    y: t.clientY,
                };

                panStart.current = {
                    ...pan,
                };

                isSwiping.current = false;
            } else {
                isSwiping.current = true;
            }
        }
    };

    const onTouchMoveRaw = useCallback(
        (e) => {
            if (
                e.touches.length === 2 &&
                touchPinchDist.current
            ) {
                e.preventDefault();

                const dist = getDist(e.touches);

                const ratio =
                    dist / touchPinchDist.current;

                setZoom(
                    Math.min(
                        5,
                        Math.max(
                            1,
                            touchZoomStart.current * ratio
                        )
                    )
                );

                return;
            }

            if (e.touches.length === 1) {
                const t = e.touches[0];

                if (
                    zoom > 1 &&
                    isDragging.current
                ) {
                    e.preventDefault();

                    setPan({
                        x:
                            panStart.current.x +
                            (t.clientX -
                                dragStart.current.x),

                        y:
                            panStart.current.y +
                            (t.clientY -
                                dragStart.current.y),
                    });
                }
            }
        },
        [zoom]
    );

    useEffect(() => {
        const el = imgWrapRef.current;

        if (!el) return;

        el.addEventListener(
            "touchmove",
            onTouchMoveRaw,
            {
                passive: false,
            }
        );

        return () => {
            el.removeEventListener(
                "touchmove",
                onTouchMoveRaw
            );
        };
    }, [onTouchMoveRaw]);

    const onTouchEnd = (e) => {
        if (e.touches.length === 0) {
            if (
                isSwiping.current &&
                zoom <= 1
            ) {
                const dx =
                    (e.changedTouches[0]?.clientX ?? 0) -
                    touchStart.current.x;

                const dy =
                    (e.changedTouches[0]?.clientY ?? 0) -
                    touchStart.current.y;

                if (
                    Math.abs(dx) > 50 &&
                    Math.abs(dx) > Math.abs(dy)
                ) {
                    if (dx > 0) {
                        goPrev();
                    } else {
                        goNext();
                    }
                }
            }

            isDragging.current = false;
            isSwiping.current = false;
            touchPinchDist.current = null;

            if (zoom <= 1.05) {
                reset();
            }
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") {
                onClose();
            }

            if (e.key === "ArrowLeft") {
                goPrev();
            }

            if (e.key === "ArrowRight") {
                goNext();
            }
        };

        window.addEventListener(
            "keydown",
            handler
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handler
            );
        };
    }, [onClose, goPrev, goNext]);

    const content = (
        <div
            className="lb-overlay"
            onClick={onClose}
        >
            <button
                className="lb-close"
                onClick={onClose}
                aria-label="Close"
            >
                <img
                    src={`${process.env.PUBLIC_URL}/sprites/icons/xrest.svg`}
                    alt=""
                />
            </button>

            <button
                className="lb-nav lb-nav--prev"
                onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                }}
                aria-label="Previous"
            >
                <img
                    style={{
                        transform: "rotate(-90deg)",
                    }}
                    src={`${process.env.PUBLIC_URL}/sprites/icons/arrow.svg`}
                    alt=""
                />
            </button>

            <div
                ref={imgWrapRef}
                className="lb-img-wrap"
                onClick={(e) =>
                    e.stopPropagation()
                }
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                style={{
                    cursor:
                        zoom > 1
                            ? "grab"
                            : "default",

                    touchAction: "none",
                }}
            >
                <img
                    src={images[current]}
                    alt=""
                    draggable={false}
                    className="lb-img"
                    style={{
                        transform: `
                            scale(${zoom})
                            translate(
                                ${pan.x / zoom}px,
                                ${pan.y / zoom}px
                            )
                        `,
                    }}
                />
            </div>

            <button
                className="lb-nav lb-nav--next"
                onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                }}
                aria-label="Next"
            >
                <img
                    style={{
                        transform: "rotate(90deg)",
                    }}
                    src={`${process.env.PUBLIC_URL}/sprites/icons/arrow.svg`}
                    alt=""
                />
            </button>

            <div>
                <div
                    className="lb-zoom-controls"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    <button
                        onClick={() =>
                            setZoom((z) =>
                                Math.max(
                                    1,
                                    z - 0.5
                                )
                            )
                        }
                    >
                        −
                    </button>

                    <span>
                        {Math.round(
                            zoom * 100
                        )}
                        %
                    </span>

                    <button
                        onClick={() =>
                            setZoom((z) =>
                                Math.min(
                                    5,
                                    z + 0.5
                                )
                            )
                        }
                    >
                        +
                    </button>

                    <button onClick={reset}>
                        ↺
                    </button>
                </div>

                <div
                    className="lb-thumbs"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    {images.map((img, i) => (
                        <button
                            key={i}
                            className={
                                "lb-thumb" +
                                (i === current
                                    ? " lb-thumb--active"
                                    : "")
                            }
                            onClick={() => {
                                setCurrent(i);
                                reset();
                            }}
                        >
                            <img
                                src={img}
                                alt=""
                                draggable={false}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return createPortal(
        content,
        document.body
    );
}
