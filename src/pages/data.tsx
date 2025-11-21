import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { loadStory, StoryData} from "@/utils/grade0Loader";


export default function DataPage() {
    const [story, setStory] = useState<StoryData | null>(null);

    useEffect(() => {
    loadStory()
        .then(story => {
        console.log("Loaded story:", story);
        setStory(story);
        })
        .catch(console.error);
    }, []);


    return (
        <>
            <Header />
            <h1 className="text-3xl font-bold p-4">Data Page</h1>
            <div>
                <pre>{JSON.stringify(story, null, 2)}</pre>
            </div>
        </>
    );
}