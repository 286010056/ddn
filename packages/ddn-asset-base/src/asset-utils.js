class AssetUtils
{
    static loadFromObject(assetPlugins) {
        global.assets = {
            transConfigs: [],
            transTypeValues: [],
            transTypeNames: []
        };
        
        for (let p in assetPlugins) {
            const currAsset = assetPlugins[p];
            if (currAsset) {
                let assetConfig;
                try {
                    assetConfig = require(currAsset + '/.ddnrc.js');
                } catch (error) {
                    throw new Error("The asset extends error: " + currAsset + " has no configure .ddnrc.js.");
                }
          
                const assetTransactions = assetConfig.transactions;
    
                if (assetTransactions && assetTransactions.length > 0) {
        
                    for (let i = 0; i < assetTransactions.length; i++) {
                        const currTrans = assetTransactions[i];
                        if (!(currTrans.name && !/^\s*$/.test(currTrans.name))) {
                            throw new Error("The asset extends error: name property required.");
                        }
                        if (!(currTrans.type && /^[1-9][0-9]*$/.test(currTrans.type))) {
                            throw new Error("The asset extends error: type property required.");
                        }

                        if (global.assets.transTypeNames[currTrans.type]) {
                            throw new Error("The asset extends error: type " + currTrans.type + " is conflicting.");
                        }

                        currTrans.package = currAsset;
           
                        global.assets.transConfigs.push(currTrans);
                        global.assets.transTypeValues[currTrans.name] = currTrans;
                        global.assets.transTypeNames[currTrans.type] = currTrans;
                    }
                }
            }
        }

        return this;
    }

    static loadFromFile(file) {
        const assetPlugins = require(file);
        return this.loadFromObject(assetPlugins);
    }

    static getTypeValue(typeName) {
        if (global.assets.transTypeValues[typeName]) {
            return global.assets.transTypeValues[typeName].type;
        }
        return -1;
    }

    static getTypeName(typeValue) {
        if (global.assets.transTypeNames[typeValue]) {
            return global.assets.transTypeNames[typeValue].name;
        }
        return null;
    }

    static isTypeValueExists(typeValue) {
        return !!global.assets.transTypeNames[typeValue];
    }

    static getAssetJsonName(typeValue) {
        var result = "";
        var typeName = this.getTypeName(typeValue) + "";
        var subNames = typeName.split(/[-_]/);
        for (var i = 0; i < subNames.length; i++) {
            var sn = subNames[i];
            if (sn && !/^\s*$/.test(sn)) {
                if (i == 0) {
                    var camelSN = sn.substring(0, 1).toLowerCase() + sn.substring(1);
                    result += camelSN;
                } else {
                    var camelSN = sn.substring(0, 1).toUpperCase()  + sn.substring(1);
                    result += camelSN;
                }
            }
        }
        return result;
    }

    static getTransactionCount() {
        return global.assets.transConfigs.length;
    }

    static getTransactionByIndex(index) {
        if (index >= 0 && index < global.assets.transConfigs.length) {
            return global.assets.transConfigs[index];
        }
        return null;
    }

    static getTransactionByTypeValue(typeValue) {
        return global.assets.transTypeNames[typeValue];
    }

    static getAssetInstanceByName(context, assetName) {
        if (context && assetName) {
            if (context.runtime && context.runtime.transaction) {
                return context.runtime.transaction.getAssetInstanceByName(assetName);
            }
        }
        return null;
    }

}

export default AssetUtils;