import { mockGeneratedContent } from "./mockData";

const API_BASE_URL = "http://localhost:8000";

export interface ProjectData {
    id?: string;
    title?: string;
    storyline: string;   // mapped from backend 'screenplay' field
    screenplay?: string; // same as storyline, kept for explicit access
    characters: any[];
    sound_design: any[];
}

export const getMockMode = () => {
    const mode = localStorage.getItem("mockMode");
    return mode === null ? true : mode === "true"; // Default to true
};

export const setMockMode = (mode: boolean) => {
    localStorage.setItem("mockMode", mode.toString());
};

export const login = async (email: string, password: string) => {
    if (getMockMode()) {
        await new Promise(r => setTimeout(r, 1000));
        return { token: "mock-jwt-token" };
    }
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

export const register = async (name: string, email: string, password: string) => {
    if (getMockMode()) {
        await new Promise(r => setTimeout(r, 1000));
        return { token: "mock-jwt-token" };
    }
    const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
};

export const getProjects = async (token: string) => {
    if (getMockMode()) {
        await new Promise(r => setTimeout(r, 500));
        return [
            { id: "1", title: "The Last Projection" },
            { id: "2", title: "Glitch House" },
        ];
    }
    const res = await fetch(`${API_BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
};

export const getProjectData = async (id: string, token: string): Promise<ProjectData> => {
    try {
        if (getMockMode()) {
            await new Promise(r => setTimeout(r, 500));
            const mockResponse = {
                id,
                title: id === "1" ? "The Last Projection" : "Glitch House",
                storyline: mockGeneratedContent.storyline,
                characters: mockGeneratedContent.characters,
                sound_design: mockGeneratedContent.sound_design,
            };
            console.log("Mock API Response (getProjectData):", mockResponse);
            return mockResponse;
        }
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            console.error("API Error (getProjectData):", res.status, res.statusText);
            throw new Error(`Failed to fetch project: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Live API Response (getProjectData):", data);
        return data;
    } catch (error) {
        console.error("Fetch Error (getProjectData):", error);
        throw error;
    }
};

export const generateProject = async (story: string, useCase: string, language: string, token: string) => {
    try {
        if (getMockMode()) {
            await new Promise(r => setTimeout(r, 2000));
            const mockResponse = {
                screenplay: mockGeneratedContent.screenplay || mockGeneratedContent.storyline,
                characters: mockGeneratedContent.characters,
                sound_design: mockGeneratedContent.sound_design,
            };
            console.log("Mock API Response (generateProject):", mockResponse);
            return mockResponse;
        }
        const res = await fetch(`${API_BASE_URL}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Assuming CORS works fine, might need mode: 'cors'
            },
            body: JSON.stringify({ story_line: story, person_role: useCase, language: language }),
        });
        if (!res.ok) {
            const errorText = await res.text().catch(() => "");
            console.error("API Error (generateProject):", res.status, res.statusText, errorText);
            throw new Error(`Generation failed: ${res.statusText}`);
        }
        const data = await res.json();
        // Map backend 'screenplay' to frontend 'storyline' expectation
        if (data.screenplay && !data.storyline) {
            data.storyline = data.screenplay;
        }
        // Keep screenplay accessible by its original field name too
        if (data.storyline && !data.screenplay) {
            data.screenplay = data.storyline;
        }
        console.log("Live API Response (generateProject):", data);
        return data;
    } catch (error) {
        console.error("Fetch Error (generateProject):", error);
        throw error;
    }
};

export const saveProject = async (data: any, token: string) => {
    if (getMockMode()) {
        await new Promise(r => setTimeout(r, 500));
        return { id: Math.random().toString(36).substr(2, 9), title: "New Generated Story" };
    }
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save project");
    return res.json();
};
