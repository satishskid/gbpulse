import React from 'react';
import ReactWordcloud from 'react-wordcloud';
import type { GroundingSource } from '../types';

// List of common words to ignore for a more meaningful word cloud
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'about', 'in', 'out', 'of', 'is', 'are', 'was', 'were', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their', 'how', 'what', 'when', 'where', 'why', 'new', 'news', 'study', 'research', 'paper', 'says', 'show', 'shows', 'using', 'via', 'for', 'on', 'in', 'with', 'to', 'and', 'of', 'the', 'ai', 'llm', 'llms', 'model', 'models', 'after', 'can', 'has', 'have', 'be', 'will', 'report', 'insights', 'analysis', 'health', 'healthcare'
]);

interface SourceWordCloudProps {
    sources: GroundingSource[];
}

interface WordData {
    text: string;
    value: number;
}

const SourceWordCloud: React.FC<SourceWordCloudProps> = ({ sources }) => {
    const words: WordData[] = React.useMemo(() => {
        const wordCount: { [key: string]: number } = {};

        sources.forEach(source => {
            // Split title into words, remove punctuation, convert to lowercase
            const sourceWords = source.title
                .toLowerCase()
                .replace(/[^\w\s]|_/g, '') // remove punctuation
                .split(/\s+/);

            sourceWords.forEach(word => {
                if (word.length > 2 && !STOP_WORDS.has(word)) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });
        });

        return Object.entries(wordCount)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value) // Sort by frequency
            .slice(0, 50); // Take top 50 words
    }, [sources]);

    if (words.length < 5) {
        // Don't render if there's not enough data for a meaningful cloud
        return null; 
    }

    const options = {
        colors: ["#22d3ee", "#a5f3fc", "#f8fafc", "#67e8f9", "#0e7490"],
        enableTooltip: true,
        deterministic: true,
        fontFamily: "sans-serif",
        fontSizes: [14, 50] as [number, number],
        fontStyle: "normal",
        fontWeight: "bold",
        padding: 1,
        rotations: 2,
        rotationAngles: [0, 0] as [number, number], // No rotation for cleaner look
        scale: "sqrt",
        spiral: "archimedean",
        transitionDuration: 1000
    };

    return (
        <div className="w-full h-64 md:h-80" aria-label="Word cloud of source topics">
            <ReactWordcloud words={words} options={options} />
        </div>
    );
};

export default SourceWordCloud;
