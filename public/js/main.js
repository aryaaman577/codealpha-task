document.addEventListener('DOMContentLoaded', function() {
  
  const autoHideAlerts = () => {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
      setTimeout(() => {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
      }, 5000);
    });
  };

  autoHideAlerts();

  const handleLikeButton = () => {
    const likeButtons = document.querySelectorAll('.like-button');
    
    likeButtons.forEach(button => {
      button.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const postId = this.dataset.postId;
        const likeCountSpan = this.querySelector('.like-count');
        const likeIcon = this.querySelector('i');
        
        try {
          const response = await fetch(`/api/post/${postId}/like`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            likeCountSpan.textContent = data.likesCount;
            
            if (data.liked) {
              this.classList.add('liked');
              likeIcon.classList.remove('bi-heart');
              likeIcon.classList.add('bi-heart-fill');
            } else {
              this.classList.remove('liked');
              likeIcon.classList.remove('bi-heart-fill');
              likeIcon.classList.add('bi-heart');
            }
          }
        } catch (error) {
          console.error('Like error:', error);
        }
      });
    });
  };

  handleLikeButton();

  const handleFollowButton = () => {
    const followButtons = document.querySelectorAll('.follow-button');
    
    followButtons.forEach(button => {
      button.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const userId = this.dataset.userId;
        
        try {
          const response = await fetch(`/api/user/${userId}/follow`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            if (data.following) {
              this.classList.remove('btn-primary');
              this.classList.add('btn-secondary');
              this.textContent = 'Unfollow';
            } else {
              this.classList.remove('btn-secondary');
              this.classList.add('btn-primary');
              this.textContent = 'Follow';
            }
            
            setTimeout(() => location.reload(), 500);
          }
        } catch (error) {
          console.error('Follow error:', error);
        }
      });
    });
  };

  handleFollowButton();

  const characterCounter = () => {
    const textareas = document.querySelectorAll('textarea[data-max-length]');
    
    textareas.forEach(textarea => {
      const maxLength = parseInt(textarea.dataset.maxLength);
      const counterId = textarea.dataset.counter;
      const counter = document.getElementById(counterId);
      
      if (counter) {
        const updateCounter = () => {
          const remaining = maxLength - textarea.value.length;
          counter.textContent = `${remaining} characters remaining`;
          
          if (remaining < 50) {
            counter.classList.add('warning');
            counter.classList.remove('danger');
          }
          if (remaining < 20) {
            counter.classList.add('danger');
            counter.classList.remove('warning');
          }
          if (remaining >= 50) {
            counter.classList.remove('warning', 'danger');
          }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
      }
    });
  };

  characterCounter();

  const imagePreview = () => {
    const imageInputs = document.querySelectorAll('input[type="file"][accept="image/*"]');
    
    imageInputs.forEach(input => {
      input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const previewId = this.dataset.preview;
        const preview = document.getElementById(previewId);
        
        if (file && preview) {
          const reader = new FileReader();
          
          reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
          };
          
          reader.readAsDataURL(file);
        }
      });
    });
  };

  imagePreview();

  const confirmDelete = () => {
    const deleteButtons = document.querySelectorAll('.confirm-delete');
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const confirmed = confirm('Are you sure you want to delete this? This action cannot be undone.');
        if (!confirmed) {
          e.preventDefault();
        }
      });
    });
  };

  confirmDelete();

  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      const searchInput = this.querySelector('input[name="q"]');
      if (!searchInput.value.trim()) {
        e.preventDefault();
      }
    });
  }

});
