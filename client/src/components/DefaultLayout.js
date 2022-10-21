import React from 'react';
import '../resources/layout.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DefaultLayout({ children }) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = React.useState(false);
    const { user } = useSelector(state => state.users);
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-3-line'
        },
        {
            name: 'Bookings',
            path: '/bookings',
            icon: 'ri-booklet-line'
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-user-5-line'
        },
        {
            name: 'Logout',
            path: '/logout',
            icon: 'ri-logout-circle-line'
        }
    ];
    const adminMenu = [{
        name: 'Home',
        path: '/',
        icon: 'ri-home-3-line'
    },
    {
        name: 'Buses',
        path: '/admin/buses',
        icon: 'ri-bus-2-fill'
    },
    {
        name: 'Users',
        path: '/admin/users',
        icon: 'ri-user-6-line'
    },
    {
        name: 'Bookings',
        path: '/admin/bookings',
        icon: 'ri-booklet-line'
    },
    {
        name: 'Logout',
        path: '/logout',
        icon: 'ri-logout-circle-line'
    }
    ];
    const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
    let activeRoute = window.location.pathname;
    if (window.location.pathname.includes('book-now')) {
        activeRoute = '/';
    }


    return (
        <div className="Layout-parent">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Bus</h1>
                    <h1 className="role">{user?.name}<br />Role: {user?.isAdmin ? 'Admin' : 'User'}</h1>
                </div>

                <div className="d-flex flex-column gap-3 justify-content-start menu">
                    {menuToBeRendered.map((item, index) => {
                        return <div className={` ${activeRoute === item.path && `active-menu-item`} menu-item `}>
                            <i className={item.icon}></i>
                            {!collapsed && <span onClick={() => {
                                if (item.path === '/logout') {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }
                                else {
                                    navigate(item.path);
                                }
                            }}>{item.name}</span>}
                        </div>
                    })}
                </div>

            </div>
            <div className="body">
                <div className="header">
                    {collapsed
                        ? (<i class="ri-menu-5-line" onClick={() => setCollapsed(!collapsed)}></i>)
                        : (<i class="ri-close-circle-line" onClick={() => setCollapsed(!collapsed)}></i>)
                    }
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DefaultLayout;