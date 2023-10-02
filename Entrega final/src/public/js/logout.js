const logoutButton = document.getElementById("log_out");

logoutButton.addEventListener("click", function () {
  fetch("/api/sessions/logout", {
    method: "POST",
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("log out")
        // Redirige a la página de inicio de sesión
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          title: `Cerrando sesion...`,
          icon: "success",
        });
        setTimeout(() => {window.location.replace("/login");}, 2000)
        
      }
    })
    .catch((error) => {
      console.error("Error al realizar la petición:", error);
    });
});