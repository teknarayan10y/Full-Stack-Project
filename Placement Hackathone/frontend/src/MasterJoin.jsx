import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

function MasterJoin() {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/events/slug/${slug}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
            });
    }, [slug]);

    const handleJoinClick = async (type, link) => {
        // Increase join count only when user clicks a link
        try {
            await fetch(`http://localhost:5000/api/events/join/${slug}`, {
                method: "POST"
            });
            // Update local state to reflect the new count immediately
            setEvent(prev => ({ ...prev, joinCount: prev.joinCount + 1 }));
        } catch (error) {
            console.error("Failed to increment join count", error);
        }

        // Open the link in a new tab
        window.open(link, "_blank", "noopener,noreferrer");
    };

    if (!event) return <h2>Loading...</h2>;

    return (
        <div className="container">
            <h1>{event.title}</h1>
            <p>{event.description}</p>

            <button
                onClick={() => handleJoinClick('whatsapp', event.whatsappLink)}
                className="btn whatsapp"
            >
                Join WhatsApp
            </button>

            <button
                onClick={() => handleJoinClick('telegram', event.telegramLink)}
                className="btn telegram"
            >
                Join Telegram
            </button>

            <button
                onClick={() => handleJoinClick('instagram', event.instagramLink)}
                className="btn instagram"
            >
                Follow Instagram
            </button>

            <p>Total Joins: {event.joinCount}</p>
        </div>
    );
}

export default MasterJoin;