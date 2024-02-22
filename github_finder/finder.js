class UI {
    constructor() {
      this.profile = document.getElementById('profile');
    }
  
    showProfile(user) {
      this.profile.innerHTML = `
        <div class="card card-body mb-3">
          <div class="row">
            <div class="col-md-3">
              <img class="img-fluid mb-2" src="${user.avatar_url}">
              <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
            </div>
            <div class="col-md-9">
              <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
              <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
              <span class="badge badge-success">Followers: ${user.followers}</span>
              <span class="badge badge-info">Following: ${user.following}</span>
              <br><br>
              <ul class="list-group">
                <li class="list-group-item">Company: ${user.company}</li>
                <li class="list-group-item">Website/Blog: ${user.blog}</li>
                <li class="list-group-item">Location: ${user.location}</li>
                <li class="list-group-item">Member Since: ${user.created_at}</li>
              </ul>
            </div>
          </div>
        </div>
        <h3 class="page-heading mb-3">Latest Repos</h3>
        <div id="repos"></div>
      `;
    }
  
    showRepos(repos) {
      let output = '';
  
      repos.forEach(function(repo) {
        output += `
          <div class="card card-body mb-2">
            <div class="row">
              <div class="col-md-6">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
              </div>
              <div class="col-md-6">
              <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
              <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
              <span class="badge badge-success">Forks: ${repo.forms_count}</span>
              </div>
            </div>
          </div>
        `;
      });
  
      document.getElementById('repos').innerHTML = output;
    }
  
    showAlert(message, className) {
      this.clearAlert();
      const div  =  document.createElement('div');
      div.className = className;
      div.appendChild(document.createTextNode(message));
      const container =  document.querySelector('.searchContainer');
      const search = document.querySelector('.search');
      container.insertBefore(div, search);
  
      setTimeout(() => {
        this.clearAlert();
      }, 3000);
    }
  
    clearAlert() {
      const currentAlert = document.querySelector('.alert');
  
      if(currentAlert){
        currentAlert.remove();
      }
    }
  
    clearProfile() {
      this.profile.innerHTML = '';
    }

    showContributions(contributions) {
      const contributionsContainer = document.createElement('div');
      contributionsContainer.className = 'contributions-container';
      let contributionsHtml = '<h3 class="page-heading mb-3">Contributions</h3>';

      // 간단한 잔디 시각화: 예시 데이터를 바탕으로 시각화 생성
      contributionsHtml += '<div class="contributions">';
      for (let i = 0; i < contributions.length; i++) {
          const contribution = contributions[i];
          contributionsHtml += `<div class="contribution" style="background-color: ${this.getContributionColor(contribution.count)};" title="Commits: ${contribution.count}"></div>`;
      }
      contributionsHtml += '</div>';

      contributionsContainer.innerHTML = contributionsHtml;
      this.profile.appendChild(contributionsContainer);
  }
  
  getContributionColor(count) {
    if (count > 10) return '#216e39';
    if (count > 5) return '#30a14e';
    if (count > 1) return '#40c463';
    return '#ebedf0';
  }

}

class Github {
    constructor() {
      this.client_id = '0706c56b64270482b1da';
      this.client_secret = '57de3b5f7e046ac3fb0bc379e93872bac9448ecd';
      this.repos_count = 5;
      this.repos_sort = 'created: asc';
    }
  
    async getUser(user) {
      const profileResponse =
        await fetch(
          `https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`
        );
  
      const repoResponse =
        await fetch(
          `https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`
        );
  
      const profile = await profileResponse.json();
      const repos = await repoResponse.json();
  
      return {
        profile,
        repos
      }
    }
}

const github = new Github;
const ui = new UI;

const searchUser = document.getElementById('searchUser');

searchUser.addEventListener('keyup', (e) => {
  const userText = e.target.value;

  if(userText !== ''){
   github.getUser(userText)
    .then(data => {
      if(data.profile.message === 'Not Found') {
        ui.showAlert('User not found', 'alert alert-danger');
      } else {
        ui.showProfile(data.profile);
        ui.showRepos(data.repos);
        ui.showContributions([{count: 5}, {count: 2}, {count: 8}, {count: 4}, {count: 6}]);
      }
    })
  } else {
    ui.clearProfile();
  }
}); 