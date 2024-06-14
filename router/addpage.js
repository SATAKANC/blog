const express = require('express');
const router = express.Router();
const { join } = require('path');
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'));
const fs = require('fs');

const nowTime = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const allName = `${day}.${month + 1}.${year}`;
    return allName;
};

router.get('/', (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/error');
    }

    console.log(req.session.userID);
    return res.render('site/add');
});

router.post('/', async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'yetkisiz erişim'
            });
        }

        if (!req.body || !req.files) {
            return res.json({
                case: false,
                message: 'veri iletilemedi, req.body req.files'
            });
        }

        const { title, content, name } = req.body;
        const { file } = req.files;

        if (!title || !content || !name || !file) {
            return res.json({
                case: false,
                message: 'veri iletilemedi, eksik veri'
            });
        }

        if (file.size > 1024 * 1024 * 5) {
            return res.json({
                case: false,
                message: 'dosya boyutu istenilen aralıkta değil'
            });
        }

        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            const extension = file.mimetype.split('/')[1];
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
            const directory = join(__dirname, '..', 'public', 'images', 'content');
            const pathName = join(directory, uniqueName);

            // Klasörün var olup olmadığını kontrol edin, yoksa oluşturun
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }

            file.mv(pathName, async (err) => {
                if (err) {
                    console.error('Dosya taşınırken hata oluştu:', err);
                    console.log('Dosya yolu:', pathName);
                    return res.json({
                        case: false,
                        message: 'dosya eklenemedi'
                    });
                }

                try {
                    const db = new Content({
                        title,
                        content,
                        name,
                        'path': `/images/content/${uniqueName}`, // Tarayıcıdan erişilebilir yol
                        date: nowTime()
                    });

                    await db.save();
                    return res.json({
                        case: true,
                        message: 'veri başarılı olarak eklendi'
                    });
                } catch (err) {
                    console.log(err);
                    return res.json({
                        case: false,
                        message: 'hata oluştu'
                    });
                }
            });
        } else {
            return res.json({
                case: false,
                message: 'dosya istenilen türde değil'
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            case: false,
            message: 'Beklenilmeyen bir hata oluştu!'
        });
    }
});

module.exports = router;
