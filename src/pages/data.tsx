import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { loadCurriculum} from "@/utils/grade1Loader";


export default function DataPage() {
    const [curriculum, setCurriculum] = useState(null);

    useEffect(() => {
    loadCurriculum()
        .then(curriculum => {
        console.log("Loaded curriculum:", curriculum);
        setCurriculum(curriculum);
        })
        .catch(console.error);
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