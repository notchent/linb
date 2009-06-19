(linb.Locale.ja||(linb.Locale.ja={})).VisualJS={
    message:"システムからのメッセージ",
    noMessage:"VisuleJS Ajax/javascript UI Builder!へようこそ",
    soon:'少々お待ちください',
    ok:'OK',
    cancel:'キャンセル',
    notsave:'保存しない',
    notsave2:'ファイルを保存せずに閉じようとしています。<p>[はい]をクリックすると破棄して閉じます。[いいえ]をクリックすると保存できます。',
    notsave3:'デバッグの前に修正箇所を保存していません。<p>[はい] をクリックすると保存せずにデバッグします。[いいえ]をクリックすると保存できます。',
    checkOK:'シンタックスエラーはありませんでした',
    en:'英語',
    cn:'中国語',
    ja:'日本語',
    langTips:'表示言語を切り替えます。',
    
    builder:{

        open:'開く',
        openTips:'ファイルを開きます。',
        save:'保存',
        saveTips:'ファイルを保存、またはダウンロードします。',
        run:'実行',
        runTips:'デバッグページでjsLinbを実行します。',
        dftTheme:'デフォルトテーマ',
        dftThemeTips:'テーマを変更します。',
        advancedBuilder:'Advanced',
        originalFile:"オリジナルファイル: ",
        issave2server:"サーバ上のオリジナルファイルを上書きしますか?",
        save2serverOK:'サーバへの保存ができました。',
        nosavefirst:'ファイルを保存せずに閉じようとしています。よろしいですか?',
        
        savetoserver:'サーバに保存する',
        savetolocal:"jsLinbクラスファイル(.js)をローカルディスクに保存",
        saveashtml:"実行可能ファイル(.html)をローカルディスクに保存",
        saveaszip:"リリースパッケージ(.zip)をローカルディスクに保存",
        
        themeDft:'デフォルトのテーマ',
        themeAqua:'Aquaテーマ',
        themeVista:'Vistaテーマ',
        
        noexist:"$0 は存在しません"
    },
    
    menu:{
        file:'プロジェクト',
        newproject:'新規プロジェクト',
        openproject:'プロジェクトを開く',
        closeproject:'プロジェクトを閉じる',
        save:'保存',
        saveall:'すべて保存',

        tools: 'ツール',
        command:'コマンドウインドウ',
        spy:'ウィジェットスパイ',

        build: 'ビルド',
        debug: 'アプリケーションの実行',
        release: 'パッケージのダウンロード',
        setting: 'ビルドの設定',

        help: 'ヘルプ',
        simple:'Simple Version',
        forum: 'フォーラムを開く',
        license:'ライセンス',
        gpllicense:'LGPLライセンス',
        clicense: '商用ライセンス',
        purchase:'ライセンスの購入',
        about: 'このアプリケーションについて'
    },
    tool:{
        newp:'新規プロジェクト',
        open:'プロジェクトを開く',
        save:'保存',
        saveall:'すべてのファイルを保存',
        command:'コマンドウインドウを開く',
        spy:'ウィジェットスパイウインドウを開く',
        debug:'現在のプロジェクトを実行',
        release:'現在のプロジェクトをパッケージ化して保存',
        ec:'言語を中国語に翻訳',
        manual:'Visual Builderマニュアル',
        api:'Components APIリファレンス',              
        demo:'サンプル',
        flash:'ビデオプレゼンテーション'
    },
    tool2:{
        'new':'新規ファイル',
        del: '現在のファイルを削除',
        refresh:'プロジェクトファイルを更新',
        refreshOK:'プロジェクトは更新されました'
    },

    pm:{
        title:'プロジェクトマネージャ',
        html:'HTMLファイル',
        js:'Classファイル'
    },
    ps:{
        noselected:'プロジェクトを選択してください。',
        noprj:'開くプロジェクトはありません',
        getting:'プロジェクトのリストを取得中',
        saved:'$0個のファイルを保存しました。',
        noSaved:'最後に保存した状態からの変更はありませんでした。'
    },
    projectPro:{
        name:"プロジェクト名 :",
        'class':"クラス名 :",
        pagefile:"ページファイル :",
        classfile:"クラスファイル :",
        onlyword:'3〜15文字が有効です',
        invalid :'いくつかのフィールドが正しくありません'
    },
    dialog:{
        newone:'新規プロジェクトの作成...',
        select:'開くプロジェクトを選択してください'
    },
    pageEditor:{
        formatted:'フォーマットされたコード'
    },
    classEditor:{
        nv:'ソースコード',
        sv:'画面構造',
        dv:'デザイン',
        nvtips:'ソースコードを表示します',
        svtips:'ソースコードの構造を表示します',
        dvtips:'UIウィジェットを配置して画面設計を行います',
        codeerr:'以下のエラーにより、コードを貼り付けられません: $0!'
    },
    pageEditor:{
        format: "ソースの表示",
        check:"シンタックスチェック",
        'reset':"コードのリセット",
        formattips:"コードを整理し、新しいダイアログで表示",
        checktips:"コードのチェック",
        resettips:"コードをリセットします"
    },
    classtool:{
        err1:'コードにエラーがあります。前の画面に戻り確認してください。',
        err2:'コードにエラーがあります。前の画面に戻り確認してください。',
        err3:'コードにエラーがあります。前の画面に戻り確認してください。',
        err4:'コードにエラーがあります。前の画面に戻り確認してください。',
        noClass:'UIのクラスファイルではありません'
    },
    designer:{
        toolsbox:'ツールボックス',
        configwnd:'コンポーネントの設定',
        
        emptyContent:'初期化中',
        prepare:'クラスの準備中',
        createContent:'デザインの更新中',
        loading:'読み込み中',
        comCodeErr:'関数 "iniComponents" の中でエラーが発生しました。コードを確認してください。',
        nameExists:'"$0"という名前のウィジェットはすでに存在ししています。',
        domIdExists:'id "$0" のDOMノードはすでに存在しています。',
        domIdValid:'DOM idには英数字のみが使用できます。',
        confirmdel:'削除しますか?',
        confirmdel2:"選択されたウィジェット($0個)を削除してもよいですか?",
        wlist: 'ウィジェット一覧',
        weditor:'ウィジェットエディタ',
        gridcol1: 'プロパティ',
        gridcol2: '値',
        colneOK:'ウィジェット $0 を複製しました',
        openwidgets:'ウィジェットのリストを展開したり閉じたりします',
        dragwidget:'このウィジェットをドラッグ&ドロップして画面を設計します',
        openapi:'ダブルクリックすると、APIリファレンスを表示します',
        tool:{
            viewsize:"表示画面サイズ",
            tocode:"選択内容をJavaScriptコードに整形",
            tojson:"選択内容をJSONコードに整形",
            left: '左にそろえる',
            center:'中央にそろえる',
            right:'右にそろえる',
            top:'上にそろえる',
            middle:'中央にそろえる',
            bottom:'下にそろえる',
            width:'同じ幅',
            wh:'同じ幅と高さ',
            height:'同じ高さ',
            toplayer: '上へ',
            bottomlayer: '下へ',
            gridxy: '位置をグリッドにそろえる',
            gridwh: '大きさをグリッドにそろえる',
            clone:'選択したコントロールを複製',
            'delete': '削除'
        }
    },
    addfile:{
        caption:'ファイルをプロジェクトに追加...',
        sel:'ターゲットフォルダの選択',
        filename:'ファイル名',
        filenameformat:'2〜9文字の英数字',
        add:'追加',
        'iDir':'フォルダ',
        'iHtml':'HTMLファイル',
        'iCSS':'CSSファイル',
        'iJs':'JSファイル',
        'iPhp':'PHPファイル',
        'target':'ターゲット',
        filetype:'ファイルの種類',
        notarget:'ファイルまたはディレクトリが存在しません。'
    },
    delfile:{
        caption:'プロジェクトからファイルを削除します',
        sel:'ファイルかフォルダを選択してください。',
        notarget:'ファイルまたはディレクトリが存在しません。',
        confirmdel:'削除しますか?',
        confirmdel2:"選択された $0 を削除してもよろしいですか?"
    }
}
