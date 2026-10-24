const { createApp } = Vue;

createApp({
  data() {
    return {
      navbarHtml: "",

      inputDO: "",
      hasilPencarian: null,
      pesanError: "",
      databaseTracking: app.tracking,

      listEkspedisi: app.pengirimanList,
      listPaket: app.paket,
      daftarDO: [],

      form: {
        noDO: "",
        nim: "",
        nama: "",
        ekspedisi: "",
        kodePaket: "",
        tanggalKirim: new Date().toISOString().substring(0, 10),
      },
    };
  },
  computed: {
    paketTerpilih() {
      if (!this.form.kodePaket) return null;
      return this.listPaket.find((p) => p.kode === this.form.kodePaket);
    },
  },
  mounted() {
    this.loadNavbar();

    this.generateNomorDO();
  },
  methods: {
    loadNavbar() {
      fetch("navbar.html")
        .then((response) => response.text())
        .then((data) => {
          this.navbarHtml = data;
        })
        .catch((err) => console.error("Gagal memuat navbar:", err));
    },

    cariDO() {
      this.hasilPencarian = null;
      this.pesanError = "";

      if (this.inputDO.trim() === "") {
        this.pesanError = "Silakan masukkan Nomor Delivery Order!";
        return;
      }

      const dataKetemu = this.databaseTracking[this.inputDO];

      if (dataKetemu) {
        this.hasilPencarian = dataKetemu;
      } else {
        this.pesanError = `Data dengan nomor ${this.inputDO} tidak ditemukan.`;
      }
    },

    generateNomorDO() {
      const tahun = new Date().getFullYear();
      const sequence = this.daftarDO.length + 1;
      const sequenceStr = String(sequence).padStart(4, "0");
      this.form.noDO = `DO${tahun}-${sequenceStr}`;
    },

    simpanDO() {
      if (
        !this.form.nim ||
        !this.form.nama ||
        !this.form.ekspedisi ||
        !this.form.kodePaket
      ) {
        alert("Mohon lengkapi seluruh isian form!");
        return;
      }

      const dataBaru = {
        nim: this.form.nim,
        nama: this.form.nama,
        status: "Diproses",
        ekspedisi: this.form.ekspedisi,
        tanggalkirim: this.form.tanggalKirim,
        paket: this.form.kodePaket,
        total: this.paketTerpilih.harga,
        perjalanan: [
          {
            waktu: new Date().toISOString().replace("T", " ").substring(0, 19),
            keterangan: "DO diterbitkan dan sedang diproses admin.",
          },
        ],
      };

      this.databaseTracking[this.form.noDO] = dataBaru;
      this.daftarDO.push({ noDO: this.form.noDO });

      alert(`Berhasil! Delivery Order ${this.form.noDO} telah disimpan.`);

      this.form.nim = "";
      this.form.nama = "";
      this.form.ekspedisi = "";
      this.form.kodePaket = "";

      this.generateNomorDO();
    },
  },
}).mount("#app-tracking");
