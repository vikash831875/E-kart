import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      navigate(`/profile/${user._id}`, { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  return null;
};

export default ProfileRedirect;
