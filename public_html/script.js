document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentsSection = document.getElementById('commentsSection');
    const commentIdInput = document.getElementById('commentId');

    // Загрузка комментариев при загрузке страницы
    fetchComments();

    // Обработка отправки формы
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const comment = document.getElementById('comment').value;
        const commentId = commentIdInput.value;

        if (commentId) {
            // Если commentId существует, это редактирование комментария
            editComment(commentId, name, comment);
        } else {
            // Если commentId отсутствует, это добавление нового комментария
            submitComment(name, comment);
        }
    });

    // Функция для отправки комментария на сервер
    function submitComment(name, comment) {
        fetch('/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, comment }),
        })
        .then(response => response.json())
        .then(savedComment => {
            // Добавление нового комментария на страницу
            addCommentToPage(savedComment);
        })
        .catch(error => console.error('Ошибка при отправке комментария:', error));
    }

    // Функция для редактирования комментария на сервере
    function editComment(commentId, name, comment) {
        fetch(`/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, comment }),
        })
        .then(response => response.json())
        .then(editedComment => {
            // Обновление отредактированного комментария на странице
            updateCommentOnPage(editedComment);
            // Сброс формы после редактирования
            resetForm();
        })
        .catch(error => console.error('Ошибка при редактировании комментария:', error));
    }

    // Функция для загрузки комментариев с сервера
    function fetchComments() {
        fetch('/comments')
            .then(response => response.json())
            .then(comments => {
                // Отображение комментариев на странице
                comments.forEach(comment => {
                    addCommentToPage(comment);
                });
            })
            .catch(error => console.error('Ошибка при загрузке комментариев:', error));
    }

    // Функция для добавления комментария на страницу
    function addCommentToPage(comment) {
        const commentElement = document.createElement('div');
        commentElement.innerHTML = `
            <strong>${comment.name}</strong>: ${comment.comment}
            <button style="color: black" onclick="editCommentOnPage('${comment.id}', '${comment.name}', '${comment.comment}')">Редактировать</button>
        `;
        commentsSection.appendChild(commentElement);
    }

    // Функция для редактирования комментария на странице
    function editCommentOnPage(commentId, name, comment) {
        // Заполнение формы данными для редактирования
        document.getElementById('name').value = name;
        document.getElementById('comment').value = comment;
        commentIdInput.value = commentId;
    }

    // Функция для обновления отредактированного комментария на странице
    function updateCommentOnPage(editedComment) {
        const commentElements = document.querySelectorAll(`[data-comment-id="${editedComment.id}"]`);
        commentElements.forEach(element => {
            element.innerHTML = `<strong>${editedComment.name}</strong>: ${editedComment.comment}
                                <button style="color: black" onclick="editCommentOnPage('${editedComment.id}', '${editedComment.name}', '${editedComment.comment}')">Редактировать</button>`;
        });
    }

    // Функция для сброса формы после редактирования
    function resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('comment').value = '';
        commentIdInput.value = '';
    }
});