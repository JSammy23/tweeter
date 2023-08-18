import { Routes, Route, useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import FollowList from "./FollowList";
import useUserInfo from "hooks/useUserInfo";
import Loading from "./Loading/Loading";

const ProfileContent = () => {
    const { userUid } = useParams();
    const { userInfo, loading } = useUserInfo(userUid);

    if (loading) {
        return <Loading />;
    }

  return (
    <Routes>
        <Route path="/" element={<UserProfile userInfo={userInfo} />} />
        <Route path="followers" element={<FollowList user={userInfo} listType='followers' followers={userInfo?.followers} />} />
        <Route path="following" element={<FollowList user={userInfo} listType='following' following={userInfo?.following} />} />
        <Route path="likes" element={<UserProfile userInfo={userInfo} showLikes={true} />} />
    </Routes>
  )
}

export default ProfileContent