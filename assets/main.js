// --- APPLICATION LOGIC ---

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Asynchronously load data and set up navigation
    renderProjects();
    renderBlogList();
    setupNavigation();
});

// 1. Fetches project data and renders all project cards
async function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return; // Exit if the project grid isn't on the page

    try {
        // Fetch the project data from the new JSON file
        const response = await fetch('content/projects.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const projectsData = await response.json();
        
        let gridHtml = '';
        for (const project of projectsData) {
            gridHtml += `
            <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="${project.imageUrl}" 
                     alt="${project.title} Screenshot" 
                     class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-white mb-3">${project.title}</h3>
                    <p class="text-gray-300 mb-4">
                        ${project.description}
                    </p>
                    <div class="flex gap-4">
                        <a href="${project.githubUrl}" target="_blank" class="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            GitHub
                        </a>
                        ${
                            // Conditionally add the 'Live Demo' button only if 'liveUrl' exists
                            project.liveUrl ? `
                        <a href="${project.liveUrl}" target="_blank" class="flex-1 text-center bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            Live Demo
                        </a>` : ''
                        }
                    </div>
                </div>
            </div>
            `;
        }
        grid.innerHTML = gridHtml; // Populate the grid
    } catch (error) {
        console.error("Failed to load projects:", error);
        grid.innerHTML = "<p class='text-red-400'>Error loading projects. Please check the console.</p>";
    }
}

// 2. Fetches blog metadata and renders all blog post cards
async function renderBlogList() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return; // Exit if the blog grid isn't on the page

    try {
        // Fetch the blog metadata from the new JSON file
        const response = await fetch('content/blogs.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blogData = await response.json();

        let gridHtml = '';
        for (const post of blogData) {
            // Note: We now pass the file, title, and date to showBlogPost
            gridHtml += `
            <a href="#" onclick="event.preventDefault(); showBlogPost('${post.file}', '${post.title}', '${post.date}')" class="block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <img src="${post.imageUrl}" 
                     alt="${post.title} Image" 
                     class="w-full h-48 object-cover">
                <div class="p-6">
                    <p class="text-sm text-gray-400 mb-1">${post.date}</p>
                    <h3 class="text-2xl font-semibold text-white mb-3">${post.title}</h3>
                    <p class="text-gray-300 mb-4">
                        ${post.summary}
                    </p>
                    <span class="font-medium text-cyan-400 hover:text-cyan-300">Read More &rarr;</span>
                </div>
            </a>
            `;
        }
        grid.innerHTML = gridHtml; // Populate the grid
    } catch (error) {
        console.error("Failed to load blog posts:", error);
        grid.innerHTML = "<p class='text-red-400'>Error loading blog posts. Please check the console.</p>";
    }
}

// 3. Shows a single blog post
async function showBlogPost(fileName, title, date) {
    if (!fileName || !title || !date) return;

    // Hide main content, show blog post view
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('blog-post-detail').classList.remove('hidden');

    const contentContainer = document.getElementById('blog-post-content');
    
    try {
        // Fetch the individual markdown file
        const response = await fetch(`content/blogs/${fileName}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const markdownContent = await response.text();
        
        // Convert Markdown to HTML using the 'marked' library
        const htmlContent = marked.parse(markdownContent);

        // Populate the container with metadata and rendered HTML
        contentContainer.innerHTML = `
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">${title}</h1>
            <p class="text-lg text-gray-400 mb-8">${date}</p>
            ${htmlContent}
        `;

        // Scroll to the top of the page
        window.scrollTo(0, 0);
    } catch (error) {
        console.error(`Failed to load blog post ${fileName}:`, error);
        contentContainer.innerHTML = `<p class='text-red-400'>Error loading post. Please check the console.</p>`;
    }
}

// 4. Shows the main page and hides the blog post view
function showMainPage() {
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('blog-post-detail').classList.add('hidden');
}

// 5. Handles navigation for mobile and desktop
function setupNavigation() {
    // Mobile nav toggle
    const toggleButton = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('mobile-nav-links');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    function toggleNav() {
        const isExpanded = navLinks.classList.contains('max-h-96');
        if (isExpanded) {
            navLinks.classList.remove('max-h-96');
            navLinks.classList.add('max-h-0');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            navLinks.classList.remove('max-h-0');
            navLinks.classList.add('max-h-96');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    }
    toggleButton.addEventListener('click', toggleNav);
    
    // Close mobile nav when a link is clicked
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            showMainPage();
            toggleNav();
            // We need a slight delay for the content to show before scrolling
            setTimeout(() => {
                const targetElement = document.querySelector(link.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView();
                }
            }, 100);
        });
    });

    // Handle desktop nav clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            showMainPage();
             // We need a slight delay for the content to show before scrolling
            setTimeout(() => {
                const targetElement = document.querySelector(link.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView();
                }
            }, 50);
        });
    });
}