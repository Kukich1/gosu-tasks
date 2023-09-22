<template>
    <div>

    </div>
</template>

<script>
if (this.isLoadingUserDetails) {
    return;
}
this.isLoadingUserDetails = true;
try {
    const token = localStorage.getItem("token");
    const clearToken = token.replaceAll('"', '');
    let config = {
        headers: {
            'Authorization': `Bearer ${clearToken}`,
        },
        responseType: 'blob',
    };
    const response = await axios.get(`https://gosutasks-api.vercel.app/admin/show_user_posts_collection/${user.username}?start=${date.value[0].valueOf() / 1000}&end=${date.value[1].valueOf() / 1000}`, config);
    const blobData = response.data;
    const textData = await blobData.text();
    const jsonData = JSON.parse(textData);
    console.log("jsonData", jsonData);
    this.selectedUser = user;
    this.selectedUserTasks = jsonData;
    console.log("selectedUserTasks", this.selectedUserTasks);
    this.isLoadingUserDetails = false;
}
catch (error) {
    const refresh_token = localStorage.getItem("refresh_token");
    const clearRef = refresh_token.replaceAll("\"", "");
    let config2 = {
        headers: {
            'Authorization': `Bearer ${clearRef}`
        },
    };
    const response1 = await axios.post('https://gosutasks-api.vercel.app/token/refresh/', undefined, config2);
    localStorage.removeItem("token");
    localStorage.setItem("token", JSON.stringify(response1.data.access_token));
    const token = localStorage.getItem("token");
    const clearToken = token.replaceAll("\"", "");
    let config = {
        headers: {
            'Authorization': `Bearer ${clearToken}`
        },
    };
    const response = await axios.get(`https://gosutasks-api.vercel.app/admin/show_user_posts_collection/${user.username}?start=${date.value[0].valueOf() / 1000}&end=${date.value[1].valueOf() / 1000}`, config);
    const blobData = response.data;
    const textData = await blobData.text();
    const jsonData = JSON.parse(textData);
    console.log("jsonData", jsonData);
    this.selectedUser = user;
    this.selectedUserTasks = jsonData;
    console.log("selectedUserTasks", this.selectedUserTasks);
    this.isLoadingUserDetails = false;
    console.error('Ошибка при получении задач:', error);
} finally {
    this.isLoadingUserDetails = false;
}
export default {

}
</script>

<style lang="scss" scoped></style>