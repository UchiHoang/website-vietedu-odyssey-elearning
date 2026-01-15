import Header from "@/components/Header";
import { useEffect, useState } from "react";
import grade1Curriculum from "@/data/curriculum.grade1.json";


export default function DataPage() {
    const [curriculum, setCurriculum] = useState(null);

    useEffect(() => {
        // Load curriculum directly from JSON
        setCurriculum(grade1Curriculum);
        console.log("Loaded curriculum:", grade1Curriculum);
    }, []);


    return (
        <>
            <Header />
            <h1 className="text-3xl font-bold p-4">Data Page</h1>
            <div>
                <pre>{JSON.stringify(curriculum, null, 2)}</pre>
            </div>
        </>
    );
}