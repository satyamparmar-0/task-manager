import { useLocation } from "react-router-dom"; // Import useLocation
import styles from "../styles/home.modules.css";

function Home() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userName = queryParams.get('name'); // Get the name from query params

    const logout = () => {
        window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Home</h1>
            <div className={styles.form_container}>
                <div className={styles.right}>
                    <h2 className={styles.from_heading}>Hello, {userName}!</h2> {/* Display the name */}
                    <button className={styles.btn} onClick={logout}>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
