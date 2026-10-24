const { createApp } = Vue;

createApp({
  data() {
    return {
      navbarHtml: "",
      daftarStok: app.stok,
      upbjjList: app.upbjjList,
      kategoriList: app.kategoriList,

      form: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        qty: 0,
        safety: 0,
      },
      isEdit: false,
      selectedIndex: null,

      filter: {
        upbjj: "",
        kategori: "",
        reorderOnly: false,
        sortBy: "",
        sortOrder: "asc",
      },
    };
  },
  computed: {
    filteredDanSortedStok() {
      let hasil = this.daftarStok;

      if (this.filter.upbjj !== "") {
        hasil = hasil.filter((item) => item.upbjj === this.filter.upbjj);
      }

      if (this.filter.upbjj !== "" && this.filter.kategori !== "") {
        hasil = hasil.filter((item) => item.kategori === this.filter.kategori);
      }

      if (this.filter.reorderOnly) {
        hasil = hasil.filter((item) => item.qty < item.safety);
      }

      if (this.filter.sortBy !== "") {
        hasil = hasil.slice().sort((a, b) => {
          let nilaiA = a[this.filter.sortBy];
          let nilaiB = b[this.filter.sortBy];

          if (typeof nilaiA === "string") {
            nilaiA = nilaiA.toLowerCase();
            nilaiB = nilaiB.toLowerCase();
          }

          if (nilaiA < nilaiB) return this.filter.sortOrder === "asc" ? -1 : 1;
          if (nilaiA > nilaiB) return this.filter.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      return hasil;
    },
  },
  mounted() {
    fetch("navbar.html")
      .then((response) => response.text())
      .then((html) => {
        this.navbarHtml = html;
      });
  },
  methods: {
    simpanData() {
      if (!this.form.kode || !this.form.judul) {
        alert("Kode dan Judul Bahan Ajar wajib diisi!");
        return;
      }
      if (this.isEdit) {
        this.daftarStok[this.selectedIndex] = { ...this.form };
      } else {
        this.daftarStok.push({ ...this.form });
      }

      this.resetForm();

      const modalElement = document.getElementById("modalBahanAjar");
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
    },
    editData(item) {
      this.form = { ...item };
      this.isEdit = true;

      this.selectedIndex = this.daftarStok.findIndex(
        (buku) => buku.kode === item.kode, //buku = variabel
      );
    },
    hapusData(item) {
      if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        const indexAsli = this.daftarStok.findIndex(
          (buku) => buku.kode === item.kode,
        );

        if (indexAsli !== -1) {
          this.daftarStok.splice(indexAsli, 1);
        }
      }
    },
    resetForm() {
      this.form = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        qty: 0,
        safety: 0,
      };
      this.isEdit = false;
      this.selectedIndex = null;
    },

    resetFilter() {
      this.filter = {
        upbjj: "",
        kategori: "",
        reorderOnly: false,
        sortBy: "",
        sortOrder: "asc",
      };
    },
  },
}).mount("#app-stok");
