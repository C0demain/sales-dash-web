function getFirstAndLastName(fullName: string) {
    const nameParts = fullName.split(' ');
 
    if (nameParts.length < 2) {
        return fullName;
    }
 
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
 
    return `${firstName} ${lastName}`;
}

export {getFirstAndLastName}