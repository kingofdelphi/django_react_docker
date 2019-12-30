def get_user_role(user):
    if user.is_superuser:
        return 'admin'
    if user.is_user_manager:
        return 'user_manager'
    return 'normal_user'
