import { useEffect, useState } from "react";
import { getCompletedworkerApi, getPendingBookingApi, getPendingWorkerApi, getUsersApi } from "../../api/apiInstance";
import { useAuthStore } from "../../store/Auth";
import Button from "../../UI/Button";
import Loader from "../../UI/PageLoader";
import { useHistory } from "react-router-dom";
import Modal from "../../UI/Modal";
import { HiArrowRight } from "react-icons/hi2";

const AdminBookingScreen = () => {
  const { token } = useAuthStore();
  const [bookingList, setBookingList] = useState([]);
  const [workerList, setWorkerList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    async function getPendingBookings() {
      setIsLoading(true);
      const bookingLists = await getPendingBookingApi(token);
      const workersList = await getCompletedworkerApi(token);
      const usersList = await getUsersApi(token);

      setWorkerList(workersList.data.data);
      setUserList(usersList.data.data);
      setBookingList(bookingLists.data.data);
      setIsLoading(false);
    }
    getPendingBookings();
  }, []);

  const displayBookingData = bookingList.map((booking) => {
    let user = userList.filter((user) => user.id === booking.user_id);
    let worker = workerList.filter((worker) => worker.id === booking.worker_id);
    return { id: booking.id, user: { ...user }, worker: { ...worker } };
  });

  const handleViewDetail = (e) => {
    const id = e.target.getAttribute("data-id");
    history.push(`/Admin/BookingDetail/${id}`, displayBookingData);
  };
  console.log(bookingList);

  console.log(displayBookingData);

  return (
    <>
      {displayBookingData.length > 0 ? (
        displayBookingData?.map((bookings, index) => (
          <div
            key={index}
            className="bg-zinc-50 p-2 flex items-center justify-between mt-10"
            style={{
              outline: "1px solid #4f46e5",
              borderRadius: 10,
              width: "80rem",
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <div className="flex items-end mb-6 ml-12">
              <div
                style={{ transform: `translateY(10px)` }}
                className="w-24 h-24 relative rounded-full overflow-hidden ring-2 mr-4 ring-blue-500"
              >
                <img
                  src={bookings.user[0]?.photo_urls?.[0]}
                  alt={`Profile photo of ${name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mr-12 pr-4">
                <h4 className="font-semibold">Full Name</h4>
                <p className="text-2xl">
                  {bookings.user[0].first_name[0].toUpperCase() +
                    bookings.user[0].first_name.slice(1) +
                    " " +
                    bookings.user[0].last_name[0].toUpperCase() +
                    bookings.user[0].last_name.slice(1)}
                </p>
              </div>
              <HiArrowRight style={{ fontSize: "2em", fontWeight: "bold", marginRight: "6rem" }} />

              <div
                style={{ transform: `translateY(10px)` }}
                className="w-24 h-24 relative rounded-full overflow-hidden ring-2 mr-4 ring-blue-500"
              >
                <img
                  src={bookings.worker[0]?.photo_urls?.[0]}
                  alt={`Profile photo of ${name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mr-12 pr-4">
                <h4 className="font-semibold">Full Name</h4>
                <p className="text-2xl">
                  {bookings.worker[0].first_name[0].toUpperCase() +
                    bookings.worker[0].first_name.slice(1) +
                    " " +
                    bookings.worker[0].last_name[0].toUpperCase() +
                    bookings.worker[0].last_name.slice(1)}
                </p>
              </div>
            </div>
            <Button data-id={bookings.id} className="mr-12" size="large" onClick={handleViewDetail}>
              View Booking
            </Button>
          </div>
        ))
      ) : (
        <Modal route="/Admin" Heading="No Pending Request" msg="" />
      )}
      {isLoading && <Loader />}
    </>
  );
};

export default AdminBookingScreen;
