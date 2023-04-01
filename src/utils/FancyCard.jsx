import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "@firebase/firestore";
import "./FancyCard.css";
import { db } from "../Config";
import { SessionService } from "../SessionService";
import { useEffect, useState } from "react";

const FancyCard = ({ collab }) => {
  const [favCollabs, setFavCollabs] = useState();

  const user = SessionService.getUser();
  const favColRef = collection(db, "users", user.id, "favorite");
  useEffect(() => {
    onSnapshot(favColRef, (snapshot) => {
      setFavCollabs(
        snapshot.docs.map((collab) => {
          return collab.data().collabId;
        })
      );
    });
  }, []);
  useEffect(() => {
    console.log(favCollabs);
  }, [favCollabs]);

  const handleAddFav = (e) => {
    e.stopPropagation();
    console.log(collab.id);
    setDoc(doc(db, "users", user.id, "favorite", collab.id), {
      collabId: collab.id,
    });
  };
  const handleRemoveFav = (e) => {
    e.stopPropagation();
    console.log(collab.id);
    console.log(user.id);
    deleteDoc(doc(db, "users", user.id, "favorite", collab.id))
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="card w-32 h-40 md:w-40 md:h-52 cursor-pointer">
      <div className="content">
        <div className="back">
          <div className="back-content flex justify-center text-center px-2">
            <strong>{collab.title}</strong>
          </div>
        </div>
        <div className="front">
          <div className="img">
            <div className="circle"></div>
            <div className="circle" id="right"></div>
            <div className="circle" id="bottom"></div>
          </div>
          <div className="front-content">
            <small className="badge">
              {collab.isPrivate ? "Private" : "Public"}
            </small>
            <div className="description">
              <div className="title">
                <p className="title">
                  <strong>{collab.description}</strong>
                </p>
                {favCollabs && !favCollabs.includes(collab.id) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:text-yellow-500"
                    onClick={(e) => {
                      handleAddFav(e);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-yellow-500 hover:text-gray-500"
                    onClick={(e) => handleRemoveFav(e)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyCard;
