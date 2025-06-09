const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Customer = require("../models/customer");
const User = require("../models/user");
router.post("/confirm", async (req, res) => {
  try {
    const {
      hoVaTen,
      cccd,
      soDienThoai,
      email,
      diaChi,
      nationalityId,
      userId, // nếu có đăng nhập
      roomId,
      ngayNhanPhong,
      ngayTraPhong,
      soNguoiLon,
      soTreEm,
    } = req.body;
    const checkInDay = new Date(ngayNhanPhong);
    const checkOutDay = new Date(ngayTraPhong);

    if (checkOutDay <= checkInDay) {
      return res
        .status(400)
        .json({ error: "Ngày trả phòng phải sau ngày nhận phòng" });
    }
    let customer;
    if (userId) {
      const user = await User.findById(userId);
      customer = await Customer.findOne(user._id);
      if (!customer) {
          customer = new Customer({
          hoVaTen: user.name,
          cccd: user.cccd,
          soDienThoai: user.phone,
          email: user.email,
          diaChi: user.address,
          nationality: user.nationalityId,
          user: user._id
        });
        await customer.save();
      }
    } else {
      customer = await Customer.findOne({ cccd });
      if (!customer) {
        customer = new Customer({
          hoVaTen,
          cccd,
          soDienThoai,
          email,
          diaChi,
          nationality: nationalityId,
        });
        await customer.save();
      }
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Phòng không tồn tại" });
    }

    const price = room.giaPhong;
    const NumOfNight = Math.ceil(
      (checkOutDay - checkInDay) / (1000 * 60 * 60 * 24)
    );
    const total = NumOfNight * price;

    const newBooking = new Booking({
      customer: customer._id || null,
      room: roomId,
      user: userId || null,
      ngayNhanPhong: checkInDay,
      ngayTraPhong: checkOutDay,
      soNgayThue: NumOfNight,
      soNguoiLon: soNguoiLon || 1,
      soTreEm: soTreEm || 0,
      tongTien: total,
    });

    await newBooking.save();
    await Room.findByIdAndUpdate(roomId, { trangThai: "Đã đặt" });
    console.log("Đã lưu booking:", newBooking);
    res.redirect(`/booking/confirm/${newBooking._id}`);
  } catch (error) {
    console.error(error);
  }
});

router.get("/confirm/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("room")
      .populate("customer")
      .populate("user");
    if (!booking) {
      return res.status(404).send("Lỗi");
    }
    res.render("bookingsuccess", { booking });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi server");
  }
});
module.exports = router;
