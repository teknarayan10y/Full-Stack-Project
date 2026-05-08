import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, MessageCircle, Send, PlusCircle, AlignLeft, Type, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import "./AdminCreateEvent.css";

function AdminCreateEvent() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        slug: "",
        description: "",
        whatsappLink: "",
        telegramLink: "",
        instagramLink: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.slug.trim()) {
            toast.error("Title and Slug are required fields");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading("Creating event...");

        try {
            const res = await fetch("http://localhost:5000/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                toast.dismiss(loadingToast);
                toast.error(data.error || "Failed to create event");
            } else {
                toast.dismiss(loadingToast);
                toast.success("Event created successfully! Redirecting...");

                setTimeout(() => {
                    navigate(`/join/${form.slug}`);
                }, 1000);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Network error. Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-create-event-container">
            <Toaster position="top-center" richColors />

            <div className="admin-form-card">
                <div className="form-header">
                    <h1><PlusCircle size={32} /> Create Event</h1>
                    <p>Add a new event and build your community links</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            name="title"
                            className="input-field"
                            placeholder="Event Title *"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <Type className="input-icon" size={20} />
                    </div>

                    <div className="input-group">
                        <input
                            name="slug"
                            className="input-field"
                            placeholder="Unique Slug (e.g. hackathon-2026) *"
                            value={form.slug}
                            onChange={handleChange}
                            required
                        />
                        <Link2 className="input-icon" size={20} />
                    </div>

                    <div className="input-group">
                        <textarea
                            name="description"
                            className="input-field"
                            placeholder="Event Description"
                            value={form.description}
                            onChange={handleChange}
                        />
                        <AlignLeft className="input-icon textarea-icon" size={20} />
                    </div>

                    <div className="input-group">
                        <input
                            name="whatsappLink"
                            className="input-field"
                            placeholder="WhatsApp Group Link"
                            value={form.whatsappLink}
                            onChange={handleChange}
                        />
                        <MessageCircle className="input-icon" size={20} />
                    </div>

                    <div className="input-group">
                        <input
                            name="telegramLink"
                            className="input-field"
                            placeholder="Telegram Group Link"
                            value={form.telegramLink}
                            onChange={handleChange}
                        />
                        <Send className="input-icon" size={20} />
                    </div>

                    <div className="input-group">
                        <input
                            name="instagramLink"
                            className="input-field"
                            placeholder="Instagram Profile Link"
                            value={form.instagramLink}
                            onChange={handleChange}
                        />
                        <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="spinner" size={22} />
                                Creating...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={22} />
                                Create Event
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminCreateEvent;