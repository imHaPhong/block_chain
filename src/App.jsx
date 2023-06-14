import { useState } from "react";
import "./App.css";
import rs from "jsrsasign";

function App() {
  const [sk, setSk] = useState("");
  const [pk, setPk] = useState("");
  const [msg, setMsg] = useState("");
  const [hSigVal, setHSigVal] = useState();
  const [isValid, setIsValid] = useState(undefined);
  const [hashedValue, setHashedValue] = useState();
  const [pkVal, setPkVal] = useState("");

  const handleCreateSignature = () => {
    const sig = new rs.KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
    sig.init(sk);
    sig.updateString(msg);
    var hashedValue = sig.sign();
    setHSigVal(hashedValue);
    setHashedValue(hashedValue);
  };

  const handleCheckSign = () => {
    var sig1 = new rs.KJUR.crypto.Signature({ alg: "SHA256withECDSA" });
    sig1.init(pkVal);
    sig1.updateString(msg);
    const result = sig1.verify(hashedValue);
    setIsValid(result);
  };

  const generateKey = () => {
    const kp = rs.KEYUTIL.generateKeypair("EC", "secp256k1");
    var privateKey = rs.KEYUTIL.getPEM(kp.prvKeyObj, "PKCS8PRV");
    var pubKey = rs.KEYUTIL.getPEM(kp.pubKeyObj, "PKCS8PUB");
    setSk(privateKey);
    setPk(pubKey);
    setPkVal(pubKey);
  };

  return (
    <div>
      <div>{sk}</div>
      <div>{pk}</div>
      <div>
        <button onClick={generateKey}>Generate keys</button>
      </div>
      <div>---------------------------------</div>
      Signature:
      <div>{hSigVal}</div>
      <div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateSignature();
            }}
          >
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.currentTarget.value)}
            />
            <button type="submit">Create Signature</button>
          </form>
        </div>
      </div>
      <div>---------------------------------</div>
      <div>
        <div>
          <label htmlFor="">Signature value</label>
          <textarea
            type="text"
            value={hashedValue}
            rows="4"
            cols="50"
            onChange={(e) => setHashedValue(e.currentTarget.value)}
          />
        </div>
        <div>
          <label htmlFor="">Public key</label>

          <textarea
            type="text"
            value={pkVal}
            onChange={(e) => setPkVal(e.currentTarget.value)}
            rows="4"
            cols="50"
          />
        </div>
        <button onClick={handleCheckSign}>Verify</button>
        {hashedValue && isValid !== undefined && (
          <div>Is valid: {isValid ? "True" : "False"}</div>
        )}
      </div>
    </div>
  );
}

export default App;
