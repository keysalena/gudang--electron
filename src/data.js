document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#barangTable tbody");
  const apiUrl = "http://127.0.0.1:8000/api/barangs";
  const authToken = "1|L87KWAL4MWj5mbjfEdyGooY188J90YcS3nu8xpTi247ba7b0";
  const apiStorage = "http://127.0.0.1:8000";

  // Function to handle form submission
  const handleFormSubmission = (barang) => {
    const modal = document.getElementById("updateModal");
    const name_barangInput = document.querySelector("#update_name_barang");
    const stokInput = document.querySelector("#update_stok");
    const image_barangInput = document.querySelector("#update_image_barang");
    const imagePreview = document.querySelector("#imagePreview");

    // Display existing data in the modal
    name_barangInput.value = barang.name_barang;
    stokInput.value = barang.stok;

    // Display the selected image or reset the preview
    imagePreview.src = ""; // Clear the preview

    // Handle image upload preview
    image_barangInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        imagePreview.src = imageUrl;
      } else {
        // Reset the preview if no file is selected
        imagePreview.src = "";
      }
    });

    modal.style.display = "block";

    // Handle form submission
    const updateBarangForm = document.getElementById("updateBarang");
    updateBarangForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Retrieve data from the form
      const updatedName = name_barangInput.value;
      const updatedStok = stokInput.value;
   //   const updatedImage = image_barangInput.files[0];

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("name_barang", updatedName);
      formData.append("stok", updatedStok);
      if (image_barangInput.value !== null && image_barangInput.value !== "") {
        formData.append(
          "image_barang",
          image_barangInput.files[0],
          image_barangInput.files[0]?.path
        );
      }
      // Make a fetch request to send the updated data to the server
      const updateUrl = `http://127.0.0.1:8000/api/barangs/${barang.id}`;

      const requestOptions = {
        method: "POST", // You may want to change this to PUT or PATCH depending on your server API.
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      fetch(updateUrl, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Data updated successfully:", data);
          modal.style.display = "none";
          location.reload(); // Reload the page or update the data in your table
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      const data = result.data;
      console.log(data);
      if (Array.isArray(data)) {
        data.forEach((barang, index) => {
          const row = tableBody.insertRow();

          const img = document.createElement("img");
          img.className = "img-fluid mx-auto card-img-top";
          img.src = `${apiStorage}${barang.image_barang}`;
          img.alt = barang.name_barang;

          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${barang.name_barang}</td>
              <td style="width: 8rem;"></td>
              <td>${barang.stok}</td>
              <td>
                <div class="d-flex gap-2">
                  <button id="edit" data-barang="${
                    barang.barang_id
                  }" class="btn btn-secondary">Edit</button>
                  <button id="delete" data-barang="${
                    barang.barang_id
                  }" class="btn btn-danger">Delete</button>
                </div>
              </td>
            `;

          // Anda perlu menambahkan elemen gambar ke sel yang sesuai di dalam row
          const imgCell = row.cells[2];
          imgCell.appendChild(img);

          // Menambahkan event listener untuk tombol "Delete"
          const deleteButton = row.querySelector("#delete");
          deleteButton.addEventListener("click", async () => {
            const idProduct = deleteButton.getAttribute("data-barang");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${authToken}`);

            const requestOptions = {
              method: "DELETE",
              headers: myHeaders,
            };

            fetch(`${apiUrl}/${idProduct}`, requestOptions)
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                // Hapus baris dari tabel setelah berhasil menghapus di server
                row.remove();
                // Memuat ulang halaman
                location.reload();
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });

          // Menambahkan event listener untuk tombol "Edit"
          const editButton = row.querySelector("#edit");
          editButton.addEventListener("click", () => {
            handleFormSubmission(barang);
          });
        });
      } else {
        console.error("Data tidak dalam bentuk array.");
      }
    });
});

const btnCloseModal = document.getElementById("btnCloseModal");
const modal = document.getElementById("updateModal");

btnCloseModal.addEventListener("click", (event) => {
  event.preventDefault();

  modal.style.display = "none";
});
