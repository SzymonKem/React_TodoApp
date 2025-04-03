import { useEffect } from "react";
export function useOutsideClick(ref, visibilitySetter, addLinkClass) {
    useEffect(() => {
        function handleOutsideClick(e) {
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                !e.target.closest(addLinkClass)
            ) {
                visibilitySetter(false);
            }
        }
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [ref, visibilitySetter, addLinkClass]);
}
