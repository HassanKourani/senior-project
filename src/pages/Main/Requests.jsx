import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import Loading from "../../utils/Loading";

const Requests = () => {
  const uid = useParams().uid;
  const [requests, setRequests] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(
      collection(db, "collaborations", uid, "requests"),
      (snapshot) => {
        setRequests(
          snapshot.docs.map((request) => (
            <div key={request.id}>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    className="w-8 h-8 rounded-full "
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                  <h1>{request.data().requestedName}</h1>
                </div>
                <div className="flex items-centers gap-2 pr-4">
                  <button
                    className="p-2 bg-red-600 text-xs"
                    onClick={() => handleDelete(request.id)}
                  >
                    Decline
                  </button>
                  <button
                    className="p-2 bg-green-600 text-xs"
                    onClick={() => handleAccept(request)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))
        );
        setIsLoading(false);
      }
    );
  }, []);

  const handleDelete = (requestId) => {
    deleteDoc(doc(db, "collaborations", uid, "requests", requestId)).then(() =>
      console.log("deleted")
    );
  };
  const handleAccept = (request) => {
    addDoc(collection(db, "collaborations", uid, "users"), {
      userId: request.data().requestedId,
      userName: request.data().requestedName,
      userImage: request.data().requestedImage,
    });
    deleteDoc(doc(db, "collaborations", uid, "requests", request.id)).then(() =>
      console.log("deleted")
    );
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : requests && requests.length ? (
        requests
      ) : (
        <div className="flex justify-center text-xl text-gray-300/50 items-center gap-4 pt-12">
          No incoming requests
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default Requests;