/**
 * main.js - Uzair Mukadam's Portfolio Logic
 * Handles dynamic content fetching, routing, and fallbacks.
 */

// Configuration & Professional Fallbacks
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop";

// Mock Data: This ensures the site is never empty, even if projects.json fails to load locally.
const MOCK_PROJECTS = [
    {
        title: "Project Data Loading...",
        description: "Your projects are being fetched from the local JSON. If you see this for a long time, ensure you are running a local server (like Live Server) or have deployed to GitHub Pages.",
        imageUrl: "",
        githubUrl: "#",
        liveUrl: null
    }
];

const APP_DATA = {
    projects: 'content/projects.json',
    blogs: 'content/blogs.json'
};

/**
 * Utility: Helper to handle missing or broken images
 */
function getSafeImage(url) {
    if (!url || typeof url !== 'string' || url.trim() === "" || url.includes("[") || url.includes("placehold.co")) {
        return DEFAULT_IMAGE;
    }
    return url;
}

/**
 * Initialize Lucide Icons
 */
function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/**
 * Fetch and Render Projects with Fallback logic
 */
async function loadProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    try {
        // Attempt to fetch the actual JSON data
        const response = await fetch(APP_DATA.projects);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        renderProjects(projects);
        
    } catch (error) {
        // Log the error for debugging (visible in F12 console)
        console.warn("Could not load projects.json. This is usually due to CORS when running locally via file:// or a missing file path.");
        
        // Render mock data so the UI doesn't look broken
        renderProjects(MOCK_PROJECTS);
    }
}

/**
 * Core rendering function for projects
 */
function renderProjects(projects) {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    if (!projects || projects.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-gray-500 italic py-10">No projects found in projects.json</p>`;
        return;
    }

    grid.innerHTML = projects.map(project => `
        <div class="project-card group bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <div class="relative overflow-hidden h-52">
                <img 
                    src="${getSafeImage(project.imageUrl)}" 
                    alt="${project.title}" 
                    onerror="this.src='${DEFAULT_IMAGE}'"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">${project.title}</h3>
                <p class="text-gray-400 text-sm mb-4 line-clamp-3">${project.description || 'No description available.'}</p>
                <div class="flex gap-3">
                    <a href="${project.githubUrl || '#'}" target="_blank" class="flex-1 inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors">
                        <i data-lucide="github" class="w-4 h-4"></i> Source
                    </a>
                    ${project.liveUrl ? `
                    <a href="${project.liveUrl}" target="_blank" class="flex-1 inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors">
                        <i data-lucide="external-link" class="w-4 h-4"></i> Demo
                    </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Refresh icons for newly injected HTML
    initIcons();
}

/**
 * Fetch and Render Blogs
 */
async function loadBlogs() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    try {
        const response = await fetch(APP_DATA.blogs);
        if (!response.ok) throw new Error("Blogs manifest not found");
        
        const blogs = await response.json();

        grid.innerHTML = blogs.map(blog => `
            <article onclick="loadBlogPost('${blog.file}')" class="blog-card cursor-pointer group bg-gray-800/50 hover:bg-gray-800 p-6 rounded-xl border border-gray-700/50 transition-all duration-300">
                <div class="mb-4 overflow-hidden rounded-lg h-40">
                    <img src="${getSafeImage(blog.imageUrl)}" alt="${blog.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                </div>
                <span class="text-cyan-400 text-xs font-bold tracking-widest uppercase">${blog.date}</span>
                <h3 class="text-xl font-bold text-white mt-2 mb-3 group-hover:text-cyan-400 transition-colors">${blog.title}</h3>
                <p class="text-gray-400 text-sm line-clamp-2">${blog.summary}</p>
                <div class="mt-4 flex items-center text-cyan-400 text-sm font-semibold">
                    Read More <i data-lucide="arrow-right" class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"></i>
                </div>
            </article>
        `).join('');
        initIcons();
    } catch (error) {
        console.warn("Could not load blogs.json");
    }
}

/**
 * Handle Single Blog Post View
 */
async function loadBlogPost(filename) {
    const detailView = document.getElementById('blog-post-detail');
    const mainContent = document.getElementById('main-content');
    const contentArea = document.getElementById('blog-post-content');

    try {
        const response = await fetch(`content/blogs/${filename}`);
        if (!response.ok) throw new Error("Post markdown file not found");
        const markdown = await response.text();
        
        mainContent.classList.add('hidden');
        detailView.classList.remove('hidden');
        
        // Ensure 'marked' library is loaded in index.html
        contentArea.innerHTML = marked.parse(markdown);
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error loading blog post:", error);
    }
}

/**
 * Navigation Utility
 */
function showMainPage() {
    document.getElementById('blog-post-detail')?.classList.add('hidden');
    document.getElementById('main-content')?.classList.remove('hidden');
}

// Navigation Events
const toggleButton = document.getElementById('mobile-nav-toggle');
const navLinks = document.getElementById('mobile-nav-links');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

function toggleNav() {
    if (!navLinks) return;
    const isExpanded = navLinks.classList.contains('max-h-96');
    if (isExpanded) {
        navLinks.classList.remove('max-h-96');
        navLinks.classList.add('max-h-0');
        menuIcon?.classList.remove('hidden');
        closeIcon?.classList.add('hidden');
    } else {
        navLinks.classList.remove('max-h-0');
        navLinks.classList.add('max-h-96');
        menuIcon?.classList.add('hidden');
        closeIcon?.classList.remove('hidden');
    }
}

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    if (toggleButton) toggleButton.addEventListener('click', toggleNav);
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', toggleNav);
    });

    loadProjects();
    loadBlogs();
    initIcons();
});