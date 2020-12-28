module.exports = (user) => {
    return {
        _id : user._id,
        dob : user.dob,
        friends : user.friends,
        username : user.username,
        email : user.email,
        created_at : user.created_at,
    }
}