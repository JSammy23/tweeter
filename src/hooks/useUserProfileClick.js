import { useNavigate } from 'react-router-dom';

export const useUserProfileClick = () => {
    const navigate = useNavigate();

    const handleUserProfileClick = async (userID) => {
        try {
            navigate(`/profile/${userID}`)
        } catch (error) {
            console.log(error)
        }
    };

    return handleUserProfileClick;
};