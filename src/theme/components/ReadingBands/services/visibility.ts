import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { getElement } from './dom';
import styles from './styles.module.css';

// // Mapping from a height range to an intersection observer threshold.
// type HeightRangeToThresholdType = {
//     // Unique identifier that is human-readable.
//     readonly friendlyName: string;

//     // Minimum element height. This range endpoint is inclusive:
//     // [minHeight, maxHeight).
//     readonly heightMinPx: number;

//     // Minimum element height. This range endpoint is exclusive:
//     // [minHeight, maxHeight).
//     readonly heightMaxPx: number;

//     // See: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
//     readonly threshold: number[];
// };

// // Friendly name of the height range that uses a dynamically generated
// // intersection observer threshold.
// const DYNAMICALLY_GENERATED_RANGE: string = 'xl';

// // Intersection observer minimum threshold chunk size. _Only_ in the "s" height
// // range, this is found by heightMaxPx / threshold.length.
// const THRESHOLD_MIN_PX: number = 16;

// // Intersection observer maximum threshold chunk size. This is found by
// // heightMaxPx / threshold.length. For example, in the "m" height range, this is
// // 960 / 4 === 240.
// const THRESHOLD_MAX_PX: number = 240;

// const HEIGHT_RANGE_TO_THRESHOLD: HeightRangeToThresholdType[] = [
//     {
//         friendlyName: 'xs',
//         heightMinPx: 0,
//         heightMaxPx: 32,
//         threshold: [1.0],
//     },
//     {
//         friendlyName: 's',
//         heightMinPx: 32,
//         heightMaxPx: 480,
//         threshold: [0.5, 1.0],
//     },
//     {
//         friendlyName: 'm',
//         heightMinPx: 480,
//         heightMaxPx: 960,
//         threshold: [0.25, 0.5, 0.75, 1.0],
//     },
//     {
//         friendlyName: 'l',
//         heightMinPx: 960,
//         heightMaxPx: 2400,
//         threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
//     },
//     {
//         friendlyName: DYNAMICALLY_GENERATED_RANGE,
//         heightMinPx: 2400,
//         heightMaxPx: Infinity,
//         threshold: [],
//     },
// ];

// function getThreshold(element: Element): number[] {
//     for (const range of HEIGHT_RANGE_TO_THRESHOLD) {
//         const height = element.getBoundingClientRect().height;
//         if (height < range.heightMinPx || height >= range.heightMaxPx) {
//             continue;
//         }
//         if (range.friendlyName === DYNAMICALLY_GENERATED_RANGE) {
//             return getDynamicThreshold(height);
//         }
//         return range.threshold;
//     }
//     throw new Error(
//         `invalid height: ${element.getBoundingClientRect().height}`);
// }

// function getDynamicThreshold(
//     height: number,
//     thresholdMinPx: number = THRESHOLD_MIN_PX,
//     thresholdMaxPx: number = THRESHOLD_MAX_PX,
// ): number[] {
//     const remainder = height % thresholdMaxPx;
//     const tempHeight =
//         (remainder && remainder <= thresholdMinPx)
//             ? height - thresholdMinPx
//             : height;

//     const defaultChunkSize = thresholdMaxPx;
//     const defaultChunkCount = Math.floor(tempHeight / defaultChunkSize);
//     const threshold = new Array(defaultChunkCount).fill(defaultChunkSize);

//     const restChunk = tempHeight - (defaultChunkCount * defaultChunkSize);
//     if (restChunk) {
//         threshold.push(restChunk);
//     }
//     if (remainder && remainder <= thresholdMinPx) {
//         threshold.push(thresholdMinPx);
//     }
//     return threshold.map(chunk => chunk / height);
// }

type Props = Readonly<{
    element: string | Element;
    onChange: IntersectionObserverCallback;
    debugBorderIsEnabled?: boolean;
    targetId?: string;
}> & IntersectionObserverInit;

export async function observeVisibility(
    {
        element,
        onChange,
        root,
        rootMargin,
        threshold,
        debugBorderIsEnabled = false,
        // TODO(dnguyen0304): Fix complex conditional parameters.
        targetId = '',
    }: Props
): Promise<Array<() => void>> {
    const env = ExecutionEnvironment;
    if (!env.canUseDOM || !env.canUseIntersectionObserver) {
        return [];
    }

    const cleanUp: Array<() => void> = [];
    const resolvedElement =
        typeof element === 'string'
            ? await getElement(element)
            : element;
    const observer = new IntersectionObserver(
        onChange,
        {
            root,
            rootMargin,
            threshold,
        },
    );

    // TODO(dnguyen0304): Add tooltip with visibility.
    if (debugBorderIsEnabled
        && !resolvedElement.classList.contains(styles.visibilityObserver_target)
    ) {
        resolvedElement.classList.add(styles.visibilityObserver_target);
        if (resolvedElement instanceof HTMLElement) {
            resolvedElement.dataset.targetId = targetId;
        }
        cleanUp.push(() => {
            resolvedElement.classList.remove(styles.visibilityObserver_target);
            if (resolvedElement instanceof HTMLElement) {
                // The MDN recommendation is to use the delete keyword, but that
                // is not compatible with Safari.
                resolvedElement.removeAttribute('data-target-id');
            }
        });
    }

    observer.observe(resolvedElement);
    cleanUp.push(() => observer.unobserve(resolvedElement));

    return cleanUp;
}