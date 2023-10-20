// ...
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#barangTable tbody");
    const apiUrl = "http://127.0.0.1:8000/api/masuks/";
    const authToken = "1|L87KWAL4MWj5mbjfEdyGooY188J90YcS3nu8xpTi247ba7b0";

    fetch(apiUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
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
            data.forEach((masuk, index) => {
                const row = tableBody.insertRow();
            
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${masuk.name_barang}</td>
                    <td>${masuk.tgl}</td>
                    <td>${masuk.stok}</td>
                    <td>
                        <div class="d-flex gap-2">
                            <button id="edit" data-masuk="${masuk.masuk_id}" class="btn btn-secondary">Edit</button>
                            <button id="delete" data-masuk="${masuk.masuk_id}" class="btn btn-danger">Delete</button>
                        </div>
                    </td>
                `;
                
                // Menambahkan event listener untuk tombol "Edit"
                const editButton = row.querySelector("#edit");
                editButton.addEventListener("click", () => {
                    const masukId = editButton.getAttribute("data-masuk");
                    // Lakukan tindakan edit di sini, seperti menampilkan modal edit.
                    // Anda dapat mengakses ID barang masuk dengan 'masukId'.
                });

                // Menambahkan event listener untuk tombol "Delete"
                const deleteButton = row.querySelector("#delete");
                deleteButton.addEventListener("click", () => {
                    const masukId = deleteButton.getAttribute("data-masuk");
                    // Lakukan tindakan delete di sini, seperti konfirmasi dan penghapusan.
                    // Anda dapat mengakses ID barang masuk dengan 'masukId'.
                });
            });
        } else {
            console.error("Data tidak dalam bentuk array.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});

// ...