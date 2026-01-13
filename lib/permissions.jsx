import Cookies from "js-cookie"

export const hasPermission = (id, permissionType) => {
    const functionalityPermission = {
        '/teacher': {
            'teacher': ['C', 'R', 'U', 'D'],
            'student': []
        }
    }
    console.log('permissions', id, permissionType)
}

export const hasPagePermission = (url, permissionType, serverUser = null) => {
    const pagePermissions = {
        '/teacher': {
            'teacher': ['R'],
            'student': []
        }
    }
    
    console.log('permissions', url, permissionType)
    
    let user = null
    
    // If serverUser is provided (from middleware), use it
    if (serverUser) {
        user = serverUser
        console.log('Using server-side user data:', user)
    } else {
        // Otherwise, read from client-side cookies (browser environment)
        const userDetails = Cookies.get('user')
        
        try {
            if (userDetails) {
                user = JSON.parse(userDetails)
                console.log('Using client-side user data:', user)
            }
        } catch (error) {
            console.error('Error parsing user details from cookies:', error)
            return false
        }
    }
    
    
    if (user && pagePermissions.hasOwnProperty(url)) {
        const pageRule = pagePermissions[url]

        if (pageRule[user.role] && pageRule[user.role].includes(permissionType)) {
            console.log('permission true', permissionType, pageRule, user)
            return true
        } else {
            console.log('permission false', permissionType, pageRule, user)
            return false
        }
    } else {
        console.log('page permission not registered', url)
        return true
    }
}