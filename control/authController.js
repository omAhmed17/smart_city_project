
const users = [
  {
    id: 'SC-1001',
    fullName: 'Alex Vance',
    email: 'citizen@smartcity.gov',
    password: 'Password123!',
    role: 'Citizen',
    phone: '+1 (555) 234-8901',
    district: 'Sector 1 — Neo-Central Core',
    bio: 'Smart City resident & digital portal user.',
    resetCode: null,
    resetCodeExpires: null
  }
];

function sanitizeUser(user) {
  if (!user) return null;
  const { password, resetCode, resetCodeExpires, ...sanitized } = user;
  return sanitized;
}


exports.register = (req, res) => {
  try {
    const { fullName, email, password, role, phone, district, bio } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        code: 'C01_MISSING_NAME',
        message: 'Full name is required.'
      });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        code: 'C01_INVALID_EMAIL',
        message: 'A valid email address is required.'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'C01_WEAK_PASSWORD',
        message: 'Password must be at least 6 characters.'
      });
    }

    const existingUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: 'C01_EMAIL_EXISTS',
        message: 'A citizen account with this email already exists.'
      });
    }

    const newCitizenId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: newCitizenId,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: role || 'Citizen',
      phone: phone || '',
      district: district || 'Sector 1 — Neo-Central Core',
      bio: bio || 'Smart City resident.',
      resetCode: null,
      resetCodeExpires: null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      action: 'C01 — Register Account',
      message: `Account registered successfully! Welcome ${newUser.fullName}.`,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('C01 Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 'C02_MISSING_CREDENTIALS',
        message: 'Email and password are required.'
      });
    }

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        code: 'C02_INVALID_CREDENTIALS',
        message: 'Invalid email or password.'
      });
    }

    return res.status(200).json({
      success: true,
      action: 'C02 — Login',
      message: 'Login successful! Citizen authenticated.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('C02 Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

exports.logout = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      action: 'C03 — Logout',
      message: 'Logged out successfully. Citizen session terminated.'
    });
  } catch (error) {
    console.error('C03 Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout.'
    });
  }
};


exports.requestResetPassword = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        code: 'C04_MISSING_EMAIL',
        message: 'Email address is required.'
      });
    }

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'C04_USER_NOT_FOUND',
        message: 'No citizen account found with this email address.'
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;

    return res.status(200).json({
      success: true,
      action: 'C04 — Reset Password (Code Generated)',
      message: `Reset verification code generated for ${email}.`,
      resetCode: resetCode
    });
  } catch (error) {
    console.error('C04 Request Reset Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset request.'
    });
  }
};

exports.resetPassword = (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        code: 'C04_MISSING_FIELDS',
        message: 'Email, verification code, and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        code: 'C04_WEAK_PASSWORD',
        message: 'New password must be at least 6 characters.'
      });
    }

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'C04_USER_NOT_FOUND',
        message: 'User not found.'
      });
    }

    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({
        success: false,
        code: 'C04_INVALID_CODE',
        message: 'Invalid reset verification code.'
      });
    }

    if (Date.now() > user.resetCodeExpires) {
      user.resetCode = null;
      user.resetCodeExpires = null;
      return res.status(400).json({
        success: false,
        code: 'C04_EXPIRED_CODE',
        message: 'Reset verification code has expired. Please request a new one.'
      });
    }

    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;

    return res.status(200).json({
      success: true,
      action: 'C04 — Reset Password (Completed)',
      message: 'Password successfully updated! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('C04 Reset Password Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset.'
    });
  }
};

exports.editProfile = (req, res) => {
  try {
    const { email, id, fullName, phone, district, bio, role } = req.body;

    // Identify user by email or id
    const user = users.find(u =>
      (email && u.email.toLowerCase() === email.toLowerCase().trim()) ||
      (id && u.id === id)
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'C05_USER_NOT_FOUND',
        message: 'Citizen not found in the records.'
      });
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (district !== undefined) user.district = district;
    if (bio !== undefined) user.bio = bio;
    if (role !== undefined) user.role = role;

    user.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      action: 'C05 — Edit Profile',
      message: 'Citizen profile updated successfully in the system.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('C05 Edit Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile.'
    });
  }
};

exports.getProfile = (req, res) => {
  try {
    const email = req.query.email || req.body.email;
    const id = req.query.id || req.body.id;

    const user = users.find(u =>
      (email && u.email.toLowerCase() === email.toLowerCase().trim()) ||
      (id && u.id === id)
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Citizen profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      action: 'C05 — View Profile',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile.'
    });
  }
};
exports.delete_user = (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.'
    });
  }
  users.splice(users.indexOf(user), 1);
  return res.status(200).json({
    success: true,
    action: 'C05 — Delete User',
    message: 'User deleted successfully.'
  });
}

exports.getAllUsers = (req, res) => {
  return res.status(200).json({
    success: true,
    totalCitizens: users.length,
    citizens: users.map(sanitizeUser)
  });
};

exports.edit_user = (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, phone, district, bio } = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        code: 'C06_USER_NOT_FOUND',
        message: 'User not found.'
      });
    }

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        code: 'C06_MISSING_FIELDS',
        message: 'fullName, email, password, and role are required for a full update (PUT).'
      });
    }

    const emailTaken = users.find(
      (u, i) => i !== userIndex && u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (emailTaken) {
      return res.status(409).json({
        success: false,
        code: 'C06_EMAIL_EXISTS',
        message: 'Another account already uses this email.'
      });
    }

    users[userIndex] = {
      id: users[userIndex].id,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone || '',
      district: district || 'Sector 1 — Neo-Central Core',
      bio: bio || 'Smart City resident.',
      resetCode: null,
      resetCodeExpires: null,
      createdAt: users[userIndex].createdAt || null,
      updatedAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      action: 'C06 — Edit User (PUT)',
      message: 'User record fully replaced successfully.',
      user: sanitizeUser(users[userIndex])
    });
  } catch (error) {
    console.error('C06 Edit User Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating user.'
    });
  }
};

exports.patch_user = (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, phone, district, bio } = req.body;

    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'C07_USER_NOT_FOUND',
        message: 'User not found.'
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        code: 'C07_NO_FIELDS',
        message: 'At least one field must be provided for a partial update (PATCH).'
      });
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const emailTaken = users.find(
        u => u.id !== id && u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          code: 'C07_EMAIL_EXISTS',
          message: 'Another account already uses this email.'
        });
      }
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (password !== undefined) user.password = password;
    if (role !== undefined) user.role = role;
    if (phone !== undefined) user.phone = phone.trim();
    if (district !== undefined) user.district = district;
    if (bio !== undefined) user.bio = bio;

    user.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      action: 'C07 — Patch User (PATCH)',
      message: 'User record partially updated successfully.',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('C07 Patch User Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while patching user.'
    });
  }
};
