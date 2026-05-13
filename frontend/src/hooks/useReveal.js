import { useEffect, useRef } from 'react';

export function useReveal(options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }) {
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Unobserve after revealing to only animate once
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        if (ref.current) {
            // Support refs being attached to single elements or arrays of elements (like querySelectorAll)
            if (ref.current.forEach) {
                ref.current.forEach(el => {
                    if (el) observer.observe(el);
                });
            } else {
                observer.observe(ref.current);
            }
        }

        return () => {
            if (ref.current) {
                if (ref.current.forEach) {
                    ref.current.forEach(el => {
                        if (el) observer.unobserve(el);
                    });
                } else {
                    observer.unobserve(ref.current);
                }
            }
        };
    }, [options.threshold, options.rootMargin]); // Only reattach if options change

    return ref;
}

export function useRevealList(options = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }) {
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const currentElements = elementsRef.current;
        currentElements.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            currentElements.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, [options.threshold, options.rootMargin, elementsRef.current.length]);

    const addToRefs = (el) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return [null, addToRefs];
}
