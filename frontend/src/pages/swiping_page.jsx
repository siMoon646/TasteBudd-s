import React, { useState, useRef, useEffect, useCallback } from 'react';

const fetchUserCardsFromAPI = async (page) => {
    await new Promise( (resolve) => setTimeout(resolve, 300) );

    return Array.from(
        {length: 10}, (_, i) => {
            const idNum = page * 10 + i + 1;
            return {
                id: 'user-${idNum}',
                name: 'User #${idNum}',
                bio: 'This is the bio of user ${idNum}...',
                tag: 'User ${idNum}',
            };
        }
    );
};

export default function DeckOfUsers() {
    const [cards, setCards] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    const dragStartRef = useRef({x: 0, y: 0});

    const loadMoreCards = useCallback(async () => {
        if(isLoading) return;
        
        setIsLoading(true);
        
        const newCards = await fetchUserCardsFromAPI(page);
        
        setCards((prevCards) => [...newCards, ...prevCards]);
        setPage((prevPage) => prevPage + 1);
        setIsLoading(false);
    }, [isLoading, page]);
    
    useEffect(() => {
        loadMoreCards();
    }, [loadMoreCards]);

    useEffect(() => {
        if(cards.length < 3 && !isLoading) {
            loadMoreCards();
        }
    }, [cards.length, isLoading, loadMoreCards]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if(cards.length === 0 || swipeDirection) return;
            if(event.key === 'ArrowRight') triggerSwipe('right');
            if(event.key === 'ArrowLeft') triggerSwipe('left');
        }; 

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cards.length, swipeDirection]);

    const handleStart = (clientX, clientY) => {
        setIsDragging(true);
        dragStartRef.current = {x: clientX, y: clientY};
    };
    
    const handleMove = (clientX, clientY) => { 
        if (!isDragging) return;
        setDragOffset({
            x: clientX - dragStartRef.current.x,
            y: clientY - dragStartRef.current.y
        })
    };

    const handleEnd = () => { 
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 120;
        if( dragOffset.x > threshold ) {
            triggerSwipe('right');
        }
        else if ( dragOffset.x < -threshold ) { 
            triggerSwipe('left');
        }
        else {
            setDragOffset({x: 0, y: 0});
        }
    };

    const triggerSwipe = (direction) => {
        setSwipeDirection(direction);
        const topCard = cards[cards.length - 1];

        console.log('Swiped ${direction} on ${topCard?.id}');

        setTimeout(() => {
            setCards((prev) => prev.slice(0, prev.length - 1));
            setDragOffset({x: 0, y: 0});
            setSwipeDirection(null);
        }, 250);
    };
    return (
        <div 
            className="min-h-screen bg-s;ate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans"
            onMouseMove = {(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp = {handleEnd}
            onMouseLeave = {handleEnd}
        >
            {/* Header Info */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-trigh text-white">Deck of Users</h1>
                <p className="text-xs text-slate-400 mt-1">
                    Swipe left to dislike, swipe right to like
                </p>
            </div>

            {/* Deck */}
            <div className="relative w-80 h-[420px] flex items-center justify-center">
                {cards.length === 0 && !isLoading && (
                    <p className="text-slate-400 text-sm font-medium"> Loading cards... </p>
                )}

                {cards.map((card, index) => {
                    const isTopCard = index === cards.length - 1;

                    let transformStyle = '';
                    if(isTopCard) {
                        let x = dragOffset.x;
                        if (swipeDirection === 'right') x = 600;
                        if (swipeDirection === 'left') x = -600;

                        const rotate = x * 0.04;
                        transformStyle = 'translate(${x}px, ${dragOffset.y}px) rotate(${rotate}deg)';
                    }
                    else {
                        const stackIndex = cards.length - 1 - index;
                        if (stackIndex > 3) return null;
                        transformStyle = 'translate3d(0px, ${stackIndex * 10}px, 0px) scale(${1 - stackIndex * 0.04})';
                    }

                    const dragProgress = Math.max( -1, Math.min(1, dragOffset.x / 150));

                    return (
                        <div
                            key={card.id}
                            style = {{
                                transform: transformStyle,
                                transition: isDragging && isTopCard ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                zIndex: index,
                            }}
                            className = {`absolute inset-0 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between ${
                                isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                            }`}
                            onMouseDown = {(e) => isTopCard && handleStart(e.clientX, e.clientY)}
                        >
                            {/* Drag Indicator Stamps */}
                            { isTopCard && (
                                <>
                                    <div 
                                        className="absolute top-6 left-6 border-4 border-emerald-500 text-emerald-500 font-extrabold text-xl px-3 py-1 rounded-lg rotate-[-12deg] pointer-events-none transition-opacity" 
                                        style={{opacity: dragProgress > 0 ? dragProgress : 0}}
                                    >
                                        YES
                                    </div>
                                    <div
                                        className="absolute top-6 right-6 border-4 border-rose-500 text-rose-500 font-extrabold text-xl px-3 py-1 rounded-lg rotate-[12deg] pointer-events-none transition-opacity"
                                        style={{opacity: dragProgress < 0 ? -dragProgress : 0}}
                                    >
                                        NO
                                    </div>
                                </>
                            )}

                            <div>
                                <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
                                    {card.tag}
                                </span>
                                <h2 className="text-2xl font-bold mt-1 text-white">{card.name}</h2>
                                <p className="text-slate-300 mt-4 text-sm leading-relaxed">{card.bio}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-500">
                                <span> ID: {card.age}</span>
                                <span> Drag or use Arrow Keys</span>
                            </div>

                        </div>  
                    );
                })}
            </div>

            {/* Desktop Click Buttons */}
            <div className="flex gap-4 mt-8 z-10">
                <button
                    onClick = {() => triggerSwipe}
                    disabled = {cards.length === 0 || !!swipeDirection}
                    className = "w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-rose-400 flex items-center hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg"
                >
                    X
                </button>
                <button
                    onClick = {() => triggerSwipe}
                    disabled = {cards.length === 0 || !!swipeDirection}
                    className = "w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 flex items-center hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-lg"
                >
                    ✓
                </button>
            </div>
        </div>
    )
}