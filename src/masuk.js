// ...

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#barangTable tbody");
    const apiUrlMasuks = "http://127.0.0.1:8000/api/masuks";
    const apiUrlBarangs = "http://127.0.0.1:8000/api/barangs";
    const authToken = "1|L87KWAL4MWj5mbjfEdyGooY188J90YcS3nu8xpTi247ba7b0";

    // Fetch data dari API /masuks
    fetch(apiUrlMasuks, {
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
            const dataMasuks = result.data;

            // Fetch data dari API /barangs
            fetch(apiUrlBarangs, {
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
                    const dataBarangs = result.data;

                    if (Array.isArray(dataMasuks)) {
                        dataMasuks.forEach((masuk, index) => {
                            const row = tableBody.insertRow();

                            // Temukan objek "barangs" yang sesuai dengan "barang_id"
                            const matchingBarang = dataBarangs.find(
                                (barang) => barang.id === masuk.barang_id
                            );

                            if (matchingBarang) {
                                row.innerHTML = `
                                    <td>${index + 1}</td>
                                    <td>${matchingBarang.name_barang}</td>
                                    <td>${masuk.tgl}</td>
                                    <td>${masuk.stok}</td>
                                    <td>
                                        <div class="d-flex gap-2">
                                            <button id="delete" data-barang="${masuk.id}" class="btn btn-danger">Delete</button>
                                        </div>
                                    </td>
                                `;

                                // Menambahkan event listener untuk tombol "Delete" di dalam loop
                                const deleteButton = row.querySelector("#delete");
                                deleteButton.addEventListener("click", () => {
                                    const idBarang = deleteButton.getAttribute("data-barang");

                                    const myHeaders = new Headers();
                                    myHeaders.append("Authorization", `Bearer ${authToken}`);

                                    const requestOptions = {
                                        method: "DELETE",
                                        headers: myHeaders,
                                    };

                                    fetch(`${apiUrlMasuks}/${idBarang}`, requestOptions)
                                        .then((response) => {
                                            if (!response.ok) {
                                                throw new Error("Network response was not ok");
                                            }
                                            // Hapus baris dari tabel setelah berhasil menghapus di server
                                            row.remove();
                                        })
                                        .catch((error) => {
                                            console.error("Error:", error);
                                        });
                                });
                            } else {
                                console.error("Barang not found for masuk:", masuk);
                            }
                        });
                    } else {
                        console.error("Data masuks tidak dalam bentuk array.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching barangs data:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching masuks data:", error);
        });
});
