document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    
    // Meminta (fetch) data dari file data.json
    fetch('data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('CORS Error: Web harus dibuka melalui Localhost.');
            }
            return response.json();
        })
        .then(portfolioData => {

            // 1. Mengisi Data Profil Dasar
            document.getElementById('profile-name').textContent = portfolioData.profile.name;
            document.getElementById('footer-name').textContent = portfolioData.profile.name;
            document.getElementById('profile-description').textContent = portfolioData.profile.description;
            document.getElementById('profile-email').textContent = portfolioData.profile.email;
            document.getElementById('profile-phone').textContent = portfolioData.profile.phone;
            document.getElementById('profile-location').textContent = portfolioData.profile.location;
            
            // 2. Mengisi Link Sosial Media & Logo PDF CV (Sejajar dalam satu baris)
            const socialLinksContainer = document.getElementById('social-links');
            if (socialLinksContainer) {
                const linkedinLink = portfolioData.profile.linkedin;
                const githubLink = portfolioData.profile.github; 
                const xLink = portfolioData.profile.x;
                const cvLink = portfolioData.profile.cvUrl;
                
                socialLinksContainer.innerHTML = 
                    `<a href="${linkedinLink}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin fa-2x"></i></a> ` +
                    `<a href="${githubLink}" target="_blank" title="GitHub"><i class="fab fa-github fa-2x"></i></a> ` + 
                    `<a href="${xLink}" target="_blank" title="X"><i class="fab fa-x-twitter fa-2x"></i></a> ` + 
                    `<a href="${cvLink}" download="CV_Asysyifau_Fathul_Umma.pdf" title="Download CV (PDF)"><i class="fas fa-file-pdf fa-2x"></i></a>`;
            }

            // 3. Mengisi Tahun di Footer
            document.getElementById('current-year').textContent = new Date().getFullYear();

            // 4. Membangun Daftar Keahlian (Skills)
            const skillsGrid = document.getElementById('skills-grid');
            portfolioData.skills.forEach(skill => {
                const span = document.createElement('span');
                if (skill.certified) {
                    span.className = 'skill-badge certified';
                    span.innerHTML = `<i class="${skill.icon}"></i> ${skill.name}`;
                } else {
                    span.className = 'skill-badge';
                    span.textContent = skill.name;
                }
                skillsGrid.appendChild(span);
            });

            // 5. Fungsi Bantuan untuk Membuat List (Education & Experience)
            function buildListSection(containerId, dataArray) {
                const container = document.getElementById(containerId);
                dataArray.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'list-item';
                    
                    let listItemsHtml = '';
                    item.details.forEach(detail => {
                        listItemsHtml += `<li>${detail}</li>`;
                    });

                    const logoHtml = item.logo ? `<img src="${item.logo}" alt="Logo" class="list-logo" onerror="this.style.display='none'">` : '';

                    div.innerHTML = `
                        <div class="list-header-block">
                            ${logoHtml}
                            <div class="list-text-group">
                                <h3>${item.institution || item.title}</h3>
                                <h4>${item.degree || item.company}</h4>
                            </div>
                        </div>
                        <ul>${listItemsHtml}</ul>
                    `;
                    container.appendChild(div);
                });
            }

            buildListSection('education-list', portfolioData.education);
            buildListSection('experience-list', portfolioData.experience);

            // 6. Membangun Daftar Proyek Dinamis Lengkap dengan Foto
            const projectsGrid = document.getElementById('projects-grid');
            portfolioData.projects.forEach(project => {
                const div = document.createElement('div');
                div.className = 'project-card';
                
                div.innerHTML = `
                    <div class="project-image-wrapper">
                        <img src="${project.image}" alt="${project.title}" class="project-img" onerror="this.src='https://via.placeholder.com/400x200?text=Foto+Projek+Belum+Ada'">
                    </div>
                    <div class="project-details">
                        <h3>${project.title}</h3>
                        <h4>${project.subtitle}</h4>
                        <p>${project.description}</p>
                    </div>
                `;
                projectsGrid.appendChild(div);
            });

            // 7. Hilangkan blank-screen dengan transisi
            mainContent.classList.remove('hidden-content');
            mainContent.classList.add('visible-content');

        })
        .catch(error => {
            console.error('Data tidak dimuat:', error);
        });
});